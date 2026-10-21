#!/usr/bin/env python3
"""TinaCRM REST client: the only way this workflow reads and writes TinaCRM.

Reads the API key from config/tinacrm_api_key.txt (never printed) and calls
<base>/rest/... with curl, because Python's SSL stack rejects the current
*.tinacrm.com certificate chain on some machines.

Usage:
  python3 scripts/tinacrm_rest.py <base_url> check
  python3 scripts/tinacrm_rest.py <base_url> upsert-company '<json>'
  python3 scripts/tinacrm_rest.py <base_url> upsert-person  '<json>'
  python3 scripts/tinacrm_rest.py <base_url> create-task    '<json>'
  python3 scripts/tinacrm_rest.py <base_url> get <object-plural> [filter]

<base_url>: e.g. https://<workspace>.tinacrm.com.

upsert-company: {"name", "domain"?, "linkedin"?, "city"?, "country"?}
  Matches an existing company by domain, then by exact name.
upsert-person:  {"firstName", "lastName"?, "email"?, "phone"?, "jobTitle"?,
                 "linkedin"?, "companyId"?}
  Matches an existing person by primary email.
create-task:    {"title", "body"?, "dueAt"?, "status"?, "assigneeId"?,
                 "personId"?, "companyId"?}
  Creates the task and links it to the person/company via taskTargets.

Output: one JSON object on stdout, {"ok": true, ...} or {"ok": false, "error": ...}.
"""
import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote

KEY_FILE = Path(__file__).resolve().parent.parent / "config" / "tinacrm_api_key.txt"


def fail(msg, **extra):
    print(json.dumps({"ok": False, "error": msg, **extra}, ensure_ascii=False))
    sys.exit(1)


def load_key():
    if not KEY_FILE.is_file() or not KEY_FILE.read_text().strip():
        fail("Missing API key in config/tinacrm_api_key.txt; run tinacrm_save_key first.")
    return "".join(KEY_FILE.read_text().split())


class Client:
    def __init__(self, base):
        base = base.rstrip("/")
        if base.endswith("/mcp"):
            base = base[:-4]
        self.base = base + "/rest"
        self.key = load_key()

    def call(self, method, path, body=None):
        # Header passed via stdin config so the key never shows up in `ps`.
        cfg = f'header = "Authorization: Bearer {self.key}"\n'
        cmd = ["curl", "-s", "-m", "60", "-K", "-", "-X", method,
               "-H", "Content-Type: application/json",
               "-w", "\n%{http_code}", self.base + path]
        if body is not None:
            cmd += ["--data-binary", json.dumps(body, ensure_ascii=False)]
        res = subprocess.run(cmd, input=cfg, capture_output=True, text=True)
        if res.returncode != 0:
            fail(f"curl exit {res.returncode}", detail=res.stderr.strip()[:300])
        text, _, code = res.stdout.rpartition("\n")
        try:
            data = json.loads(text) if text.strip() else {}
        except json.JSONDecodeError:
            data = {"raw": text[:300]}
        if not code.startswith("2"):
            fail(f"HTTP {code} on {method} {path}", detail=data)
        return data

    def find(self, plural, flt):
        data = self.call("GET", f"/{plural}?limit=5&filter={quote(flt)}")
        return data.get("data", {}).get(plural, [])

    def create(self, plural, singular, body):
        data = self.call("POST", f"/{plural}", body)
        return data.get("data", {}).get(f"create{singular[0].upper()}{singular[1:]}", data)


def link(url):
    return {"primaryLinkUrl": url, "primaryLinkLabel": ""} if url else None


def clean(d):
    return {k: v for k, v in d.items() if v not in (None, "", {})}


def upsert_company(c, a):
    if not a.get("name"):
        fail("name is required")
    domain = a.get("domain")
    if domain and not domain.startswith("http"):
        domain = "https://" + domain
    found = c.find("companies", f'domainName.primaryLinkUrl[eq]:"{domain}"') if domain else []
    if not found:
        found = c.find("companies", f'name[eq]:"{a["name"]}"')
    if found:
        return {"ok": True, "action": "existing", "id": found[0]["id"], "name": found[0].get("name")}
    body = clean({
        "name": a["name"],
        "domainName": link(domain),
        "linkedinLink": link(a.get("linkedin")),
        "address": clean({"addressCity": a.get("city"), "addressCountry": a.get("country")}),
    })
    rec = c.create("companies", "company", body)
    return {"ok": True, "action": "created", "id": rec.get("id"), "name": rec.get("name")}


def upsert_person(c, a):
    if not a.get("firstName"):
        fail("firstName is required")
    email = a.get("email")
    found = c.find("people", f'emails.primaryEmail[eq]:"{email}"') if email else []
    if found:
        return {"ok": True, "action": "existing", "id": found[0]["id"]}
    body = clean({
        "name": {"firstName": a["firstName"], "lastName": a.get("lastName", "")},
        "emails": {"primaryEmail": email, "additionalEmails": []} if email else None,
        "phones": {"primaryPhoneNumber": a["phone"]} if a.get("phone") else None,
        "jobTitle": a.get("jobTitle"),
        "linkedinLink": link(a.get("linkedin")),
        "companyId": a.get("companyId"),
    })
    rec = c.create("people", "person", body)
    return {"ok": True, "action": "created", "id": rec.get("id")}


def create_task(c, a):
    if not a.get("title"):
        fail("title is required")
    body = clean({
        "title": a["title"],
        "bodyV2": {"markdown": a["body"]} if a.get("body") else None,
        "dueAt": a.get("dueAt"),
        "status": a.get("status", "TODO"),
        "assigneeId": a.get("assigneeId"),
    })
    task = c.create("tasks", "task", body)
    targets = []
    for key, field in (("personId", "targetPersonId"), ("companyId", "targetCompanyId")):
        if a.get(key):
            t = c.create("taskTargets", "taskTarget", {"taskId": task["id"], field: a[key]})
            targets.append({field: a[key], "id": t.get("id")})
    return {"ok": True, "action": "created", "id": task.get("id"), "targets": targets}


def main():
    if len(sys.argv) < 3:
        fail(__doc__.strip().splitlines()[0])
    c = Client(sys.argv[1])
    cmd = sys.argv[2]
    arg = json.loads(sys.argv[3]) if len(sys.argv) > 3 and cmd != "get" else {}
    if cmd == "check":
        n = len(c.call("GET", "/tasks?limit=1").get("data", {}).get("tasks", []))
        out = {"ok": True, "rest": "reachable", "sample_tasks": n}
    elif cmd == "upsert-company":
        out = upsert_company(c, arg)
    elif cmd == "upsert-person":
        out = upsert_person(c, arg)
    elif cmd == "create-task":
        out = create_task(c, arg)
    elif cmd == "get":
        plural = sys.argv[3]
        path = f"/{plural}?limit=20" + (f"&filter={quote(sys.argv[4])}" if len(sys.argv) > 4 else "")
        out = {"ok": True, "data": c.call("GET", path).get("data", {}).get(plural, [])}
    else:
        fail(f"unknown command {cmd}")
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
