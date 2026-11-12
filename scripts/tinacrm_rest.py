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
  python3 scripts/tinacrm_rest.py <base_url> list <object-plural> [filter] [max]
  python3 scripts/tinacrm_rest.py <base_url> members
  python3 scripts/tinacrm_rest.py <base_url> ensure-articles-schema [--dry-run]
  python3 scripts/tinacrm_rest.py <base_url> upsert-article  '<json>'
  python3 scripts/tinacrm_rest.py <base_url> topic-digest    '<json>'
  python3 scripts/tinacrm_rest.py <base_url> articles-report '<json>'

<base_url>: e.g. https://app.tinacrm.com.

upsert-company: {"name", "domain"?, "linkedin"?, "city"?, "country"?}
  Matches an existing company by domain, then by exact name.
upsert-person:  {"firstName", "lastName"?, "email"?, "phone"?, "jobTitle"?,
                 "linkedin"?, "companyId"?}
  Matches an existing person by primary email.
create-task:    {"title", "body"?, "dueAt"?, "status"?, "assigneeId"?,
                 "personId"?, "companyId"?, "opportunityId"?, "articleId"?}
  Creates the task and links it to each given record via taskTargets.
list:           Follows pagination up to [max] records (default 200).

"Bài viết" (articles) custom object, see workflows/ADMIN_SITE.md:
ensure-articles-schema: creates the object, its fields and relations when
  missing; never changes or deletes existing ones. --dry-run only reports.
upsert-article: {"id"?, "title", "url"?, "keyword"?, "status"?, "publishedAt"?,
                 "audience"?, "campaign"?, "ideaSource"?, "draftPath"?,
                 "companyId"?, "personId"?, "opportunityId"?}
  status: PROPOSED | DRAFT | PUBLISHED | UNPUBLISHED (or Đề xuất / Nháp /
  Đã đăng / Đã gỡ). Matches by id, then url, then exact title; updates only
  the keys given.
topic-digest:   {"since"?: "YYYY-MM-DD", "max"?: 200, "industryField"?: "<company field>"}
  Compact notes, tasks, opportunities, company industries and existing
  articles, for suggesting article topics.
articles-report: {"since": "YYYY-MM-DD", "until"?: "YYYY-MM-DD"}
  Articles published in the period and the tasks linked to them.

Output: one JSON object on stdout, {"ok": true, ...} or {"ok": false, "error": ...}.
"""
import json
import subprocess
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import quote

KEY_FILE = Path(__file__).resolve().parent.parent / "config" / "tinacrm_api_key.txt"


class TinaError(Exception):
    def __init__(self, msg, **extra):
        super().__init__(msg)
        self.extra = extra


def fail(msg, **extra):
    raise TinaError(msg, **extra)


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
            fail(f"HTTP {code} on {method} {path}", status=int(code or 0), detail=data)
        return data

    def find(self, plural, flt, limit=5):
        data = self.call("GET", f"/{plural}?limit={limit}&filter={quote(flt)}")
        return data.get("data", {}).get(plural, [])

    def list(self, plural, flt=None, max_records=200):
        out, cursor = [], None
        while len(out) < max_records:
            path = f"/{plural}?limit={min(200, max_records - len(out))}"
            if flt:
                path += f"&filter={quote(flt)}"
            if cursor:
                path += f"&starting_after={quote(cursor)}"
            data = self.call("GET", path)
            out += data.get("data", {}).get(plural, [])
            info = data.get("pageInfo") or {}
            cursor = info.get("endCursor")
            if not info.get("hasNextPage") or not cursor:
                break
        return out

    def create(self, plural, singular, body):
        data = self.call("POST", f"/{plural}", body)
        return data.get("data", {}).get(f"create{singular[0].upper()}{singular[1:]}", data)

    def update(self, plural, singular, rec_id, body):
        data = self.call("PATCH", f"/{plural}/{rec_id}", body)
        return data.get("data", {}).get(f"update{singular[0].upper()}{singular[1:]}", data)

    # Metadata API (/rest/metadata/...). Workspaces answer in either the legacy
    # shape {"data": {"objects": [...]}} or the new shape {"data": [...]}.
    def objects(self):
        out, cursor = [], None
        while True:
            path = "/metadata/objects?limit=200" + (f"&starting_after={cursor}" if cursor else "")
            data = self.call("GET", path)
            items = data.get("data")
            if isinstance(items, dict):
                items = items.get("objects", [])
            out += items or []
            info = data.get("pageInfo") or {}
            cursor = info.get("endCursor")
            if not info.get("hasNextPage") or not cursor:
                return out

    def create_meta(self, kind, body):
        data = self.call("POST", f"/metadata/{kind}s", body)
        inner = data.get("data", data)
        legacy = f"createOne{kind[0].upper()}{kind[1:]}"
        return inner.get(legacy, inner) if isinstance(inner, dict) else data


def link(url):
    return {"primaryLinkUrl": url, "primaryLinkLabel": ""} if url else None


def clean(d):
    return {k: v for k, v in d.items() if v not in (None, "", {})}


def q(value):
    return str(value).replace('"', '\\"')


def upsert_company(c, a):
    if not a.get("name"):
        fail("name is required")
    domain = a.get("domain")
    if domain and not domain.startswith("http"):
        domain = "https://" + domain
    found = c.find("companies", f'domainName.primaryLinkUrl[eq]:"{q(domain)}"') if domain else []
    if not found:
        found = c.find("companies", f'name[eq]:"{q(a["name"])}"')
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
    found = c.find("people", f'emails.primaryEmail[eq]:"{q(email)}"') if email else []
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


TASK_TARGETS = (("personId", "targetPersonId"), ("companyId", "targetCompanyId"),
                ("opportunityId", "targetOpportunityId"), ("articleId", "targetArticleId"))


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
    for key, field in TASK_TARGETS:
        if a.get(key):
            t = c.create("taskTargets", "taskTarget", {"taskId": task["id"], field: a[key]})
            targets.append({field: a[key], "id": t.get("id")})
    return {"ok": True, "action": "created", "id": task.get("id"), "targets": targets}


def list_members(c):
    out = []
    for m in c.list("workspaceMembers"):
        name = m.get("name") or {}
        out.append({"id": m.get("id"), "name": f'{name.get("firstName", "")} {name.get("lastName", "")}'.strip(),
                    "email": m.get("userEmail")})
    return {"ok": True, "members": out}


# ---- "Bài viết" custom object -------------------------------------------------

ARTICLE_OBJECT = {
    "nameSingular": "article", "namePlural": "articles",
    "labelSingular": "Bài viết", "labelPlural": "Bài viết",
    "description": "Bài viết trên website doanh nghiệp (TinaCRM-Agent, workflows/ADMIN_SITE.md)",
    "icon": "IconArticle", "isLabelSyncedWithName": False,
}

STATUS_OPTIONS = [("PROPOSED", "Đề xuất", "gray"), ("DRAFT", "Nháp", "amber"),
                  ("PUBLISHED", "Đã đăng", "green"), ("UNPUBLISHED", "Đã gỡ", "red")]
STATUS_ALIASES = {label.lower(): value for value, label, _ in STATUS_OPTIONS}

ARTICLE_FIELDS = [
    {"name": "articleUrl", "label": "Đường dẫn bài", "type": "LINKS", "icon": "IconLink"},
    {"name": "focusKeyword", "label": "Từ khóa chính", "type": "TEXT", "icon": "IconKey"},
    {"name": "articleStatus", "label": "Trạng thái", "type": "SELECT", "icon": "IconProgress",
     "defaultValue": "'PROPOSED'",
     "options": [{"value": v, "label": l, "color": col, "position": i}
                 for i, (v, l, col) in enumerate(STATUS_OPTIONS)]},
    {"name": "publishedAt", "label": "Ngày đăng", "type": "DATE", "icon": "IconCalendar"},
    {"name": "audience", "label": "Ngành / nhóm khách", "type": "TEXT", "icon": "IconUsersGroup"},
    {"name": "campaign", "label": "Chiến dịch", "type": "TEXT", "icon": "IconTargetArrow"},
    {"name": "ideaSource", "label": "Nguồn ý tưởng", "type": "TEXT", "icon": "IconBulb"},
    {"name": "draftPath", "label": "Tệp nháp", "type": "TEXT", "icon": "IconFileText"},
]

ARTICLE_RELATIONS = [
    {"name": "company", "label": "Công ty", "target": "company", "icon": "IconBuildingSkyscraper"},
    {"name": "person", "label": "Người liên quan", "target": "person", "icon": "IconUser"},
    {"name": "opportunity", "label": "Cơ hội", "target": "opportunity", "icon": "IconTargetArrow"},
]


def find_object(objects, name_singular):
    return next((o for o in objects if o.get("nameSingular") == name_singular), None)


def ensure_articles_schema(c, dry_run):
    objects = c.objects()
    obj = find_object(objects, "article")
    report = {"ok": True, "dry_run": dry_run, "object": "existing" if obj else "missing",
              "fields": {}, "relations": {}}
    if obj is None:
        if dry_run:
            report["fields"] = {f["name"]: "missing" for f in ARTICLE_FIELDS}
            report["relations"] = {r["name"]: "missing" for r in ARTICLE_RELATIONS}
            return report
        try:
            obj = c.create_meta("object", ARTICLE_OBJECT)
        except TinaError as e:
            if e.extra.get("status") in (401, 403):
                fail("API key cannot change the data model; use a key whose role may edit the "
                     "data model, or create the object by hand (workflows/TINACRM_CONNECTION.md).",
                     **e.extra)
            raise
        report["object"] = "created"
        obj = find_object(c.objects(), "article") or obj
    report["object_id"] = obj["id"]
    have = {f.get("name"): f for f in obj.get("fields") or []}

    for spec in ARTICLE_FIELDS:
        name = spec["name"]
        if name in have:
            ok = have[name].get("type") == spec["type"]
            report["fields"][name] = "existing" if ok else f"existing with type {have[name].get('type')}"
            continue
        if dry_run:
            report["fields"][name] = "missing"
            continue
        c.create_meta("field", {"objectMetadataId": obj["id"], **spec})
        report["fields"][name] = "created"

    targets = {o.get("nameSingular"): o for o in objects}
    for rel in ARTICLE_RELATIONS:
        name = rel["name"]
        if name in have:
            report["relations"][name] = "existing"
            continue
        target = targets.get(rel["target"])
        if target is None:
            report["relations"][name] = f"skipped: no {rel['target']} object"
            continue
        if dry_run:
            report["relations"][name] = "missing"
            continue
        body = {"objectMetadataId": obj["id"], "type": "RELATION", "name": name,
                "label": rel["label"], "icon": rel["icon"],
                "relationCreationPayload": {"type": "MANY_TO_ONE",
                                            "targetObjectMetadataId": target["id"],
                                            "targetFieldLabel": "Bài viết",
                                            "targetFieldIcon": "IconArticle"}}
        try:
            c.create_meta("field", body)
        except TinaError:
            # The reverse field name is derived from its label; retry with a plain ASCII one.
            body["relationCreationPayload"]["targetFieldLabel"] = "Articles"
            c.create_meta("field", body)
        report["relations"][name] = "created"

    if not dry_run:
        final = find_object(c.objects(), "article") or {}
        names = {f.get("name") for f in final.get("fields") or []}
        wanted = [f["name"] for f in ARTICLE_FIELDS] + [r["name"] for r in ARTICLE_RELATIONS]
        report["verified_missing"] = [n for n in wanted if n not in names]
        report["ok"] = not report["verified_missing"]
    return report


def article_status(value):
    if not value:
        return None
    v = str(value).strip()
    if v.upper() in {s[0] for s in STATUS_OPTIONS}:
        return v.upper()
    if v.lower() in STATUS_ALIASES:
        return STATUS_ALIASES[v.lower()]
    fail(f"unknown article status {value!r}; use PROPOSED, DRAFT, PUBLISHED or UNPUBLISHED")


def upsert_article(c, a):
    found = []
    if a.get("id"):
        found = c.find("articles", f'id[eq]:"{q(a["id"])}"', 1)
    if not found and a.get("url"):
        found = c.find("articles", f'articleUrl.primaryLinkUrl[eq]:"{q(a["url"])}"', 1)
    if not found and a.get("title"):
        found = c.find("articles", f'name[eq]:"{q(a["title"])}"', 1)
    body = clean({
        "name": a.get("title"),
        "articleUrl": link(a.get("url")),
        "focusKeyword": a.get("keyword"),
        "articleStatus": article_status(a.get("status")),
        "publishedAt": a.get("publishedAt"),
        "audience": a.get("audience"),
        "campaign": a.get("campaign"),
        "ideaSource": a.get("ideaSource"),
        "draftPath": a.get("draftPath"),
        "companyId": a.get("companyId"),
        "personId": a.get("personId"),
        "opportunityId": a.get("opportunityId"),
    })
    if found:
        rec_id = found[0]["id"]
        if body:
            c.update("articles", "article", rec_id, body)
        return {"ok": True, "action": "updated", "id": rec_id, "updated": sorted(body)}
    if a.get("id"):
        fail(f"article {a['id']} not found")
    if not a.get("title"):
        fail("title is required to create an article")
    body.setdefault("articleStatus", "PROPOSED")
    rec = c.create("articles", "article", body)
    return {"ok": True, "action": "created", "id": rec.get("id")}


def text_of(rec, limit=600):
    body = (rec.get("bodyV2") or {}).get("markdown") or rec.get("body") or ""
    return " ".join(str(body).split())[:limit]


def topic_digest(c, a):
    since = a.get("since")
    max_records = int(a.get("max", 200))
    since_flt = f'createdAt[gte]:"{q(since)}"' if since else None
    notes = [{"title": n.get("title"), "text": text_of(n)} for n in c.list("notes", since_flt, max_records)]
    tasks = [{"title": t.get("title"), "text": text_of(t, 300), "status": t.get("status")}
             for t in c.list("tasks", since_flt, max_records)]
    opps = c.list("opportunities", None, max_records)
    stages = Counter(o.get("stage") for o in opps)
    customers = [{"id": o.get("id"), "name": o.get("name"), "companyId": o.get("companyId")}
                 for o in opps if o.get("stage") == "CUSTOMER"]
    companies = c.list("companies", None, max_records)
    field = a.get("industryField")
    industries = None
    if field:
        if companies and field not in companies[0]:
            industries = f"field {field!r} not found on companies"
        else:
            industries = Counter(str(co.get(field)) for co in companies if co.get(field)).most_common(30)
    try:
        articles = [{"title": r.get("name"), "keyword": r.get("focusKeyword"), "status": r.get("articleStatus"),
                     "url": (r.get("articleUrl") or {}).get("primaryLinkUrl")}
                    for r in c.list("articles", None, 500)]
    except TinaError:
        articles = "articles object not found; run ensure-articles-schema"
    return {"ok": True, "since": since, "notes": notes, "tasks": tasks,
            "opportunity_stages": dict(stages), "customer_opportunities": customers,
            "company_count": len(companies), "company_fields": sorted(companies[0]) if companies else [],
            "industries": industries, "existing_articles": articles}


def articles_report(c, a):
    if not a.get("since"):
        fail("since is required (YYYY-MM-DD)")
    flt = f'publishedAt[gte]:"{q(a["since"])}"'
    if a.get("until"):
        flt = f'and({flt},publishedAt[lte]:"{q(a["until"])}")'
    out = []
    for art in c.list("articles", flt, 500):
        targets = c.list("taskTargets", f'targetArticleId[eq]:"{art["id"]}"', 500)
        ids = [t["taskId"] for t in targets if t.get("taskId")]
        tasks = []
        for i in range(0, len(ids), 50):
            chunk = ",".join(f'"{x}"' for x in ids[i:i + 50])
            tasks += c.list("tasks", f"id[in]:[{chunk}]", 500)
        out.append({"id": art["id"], "title": art.get("name"), "status": art.get("articleStatus"),
                    "publishedAt": art.get("publishedAt"), "keyword": art.get("focusKeyword"),
                    "campaign": art.get("campaign"),
                    "url": (art.get("articleUrl") or {}).get("primaryLinkUrl"),
                    "tasks_total": len(tasks),
                    "tasks_done": sum(1 for t in tasks if t.get("status") == "DONE")})
    return {"ok": True, "since": a["since"], "until": a.get("until"), "articles": out}


def main():
    if len(sys.argv) < 3:
        fail(__doc__.strip().splitlines()[0])
    c = Client(sys.argv[1])
    cmd = sys.argv[2]
    if cmd == "check":
        n = len(c.call("GET", "/tasks?limit=1").get("data", {}).get("tasks", []))
        return {"ok": True, "rest": "reachable", "sample_tasks": n}
    if cmd == "get":
        plural = sys.argv[3]
        path = f"/{plural}?limit=20" + (f"&filter={quote(sys.argv[4])}" if len(sys.argv) > 4 else "")
        return {"ok": True, "data": c.call("GET", path).get("data", {}).get(plural, [])}
    if cmd == "list":
        plural = sys.argv[3]
        flt = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else None
        max_records = int(sys.argv[5]) if len(sys.argv) > 5 else 200
        data = c.list(plural, flt, max_records)
        return {"ok": True, "count": len(data), "data": data}
    if cmd == "members":
        return list_members(c)
    if cmd == "ensure-articles-schema":
        return ensure_articles_schema(c, "--dry-run" in sys.argv[3:])
    arg = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
    handlers = {"upsert-company": upsert_company, "upsert-person": upsert_person,
                "create-task": create_task, "upsert-article": upsert_article,
                "topic-digest": topic_digest, "articles-report": articles_report}
    if cmd not in handlers:
        fail(f"unknown command {cmd}")
    return handlers[cmd](c, arg)


if __name__ == "__main__":
    try:
        result = main()
    except TinaError as e:
        print(json.dumps({"ok": False, "error": str(e), **e.extra}, ensure_ascii=False))
        sys.exit(1)
    print(json.dumps(result, ensure_ascii=False))
