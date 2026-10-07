#!/usr/bin/env python3
"""
Tìm lead trên LinkedIn theo ICP (Bước 7-8), chạy cục bộ bằng Playwright + Google Chrome.

- Đăng nhập: bạn tự đăng nhập một lần trong cửa sổ Chrome thường (lệnh `login`), kể cả bằng Google.
  Phiên được lưu ở config/.browser_profile/linkedin; script không đọc/lưu mật khẩu.
- An toàn: giãn cách ngẫu nhiên 5-15 giây, giới hạn số trang xem mỗi lần chạy,
  dừng ngay khi gặp checkpoint/authwall.
- Email: đoán theo mẫu tên + domain website công ty, chỉ kiểm tra MX (không dò SMTP).
- Đầu ra: outputs/02_crawled_leads/leads_raw.json (lọc trùng, có nguồn + thời điểm thu thập).

Cách dùng:
  .venv/bin/python scripts/linkedin_prospector.py login
  .venv/bin/python scripts/linkedin_prospector.py run --campaign A --dry-run
  .venv/bin/python scripts/linkedin_prospector.py run --campaign A
"""

import argparse
import json
import os
import random
import re
import subprocess
import sys
import time
import unicodedata
from datetime import datetime, timezone
from urllib.parse import quote, urlparse

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICP_PATH = os.path.join(ROOT, "outputs/01_icp_criteria/icp_criteria.json")
BUSINESS_PATH = os.path.join(ROOT, "config/business.json")
OUT_DIR = os.path.join(ROOT, "outputs/02_crawled_leads")
LEADS_PATH = os.path.join(OUT_DIR, "leads_raw.json")
COMPANY_CACHE_PATH = os.path.join(OUT_DIR, "company_cache.json")
DEBUG_DIR = os.path.join(OUT_DIR, "debug")
PROFILE_DIR = os.path.join(ROOT, "config/.browser_profile/linkedin")
CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CAMPAIGN_INDEX = {"A": 0, "B": 1}
QUALIFIED_MIN = 50
HOT_MIN = 80

VN_SURNAMES = {
    "nguyen", "tran", "le", "pham", "hoang", "huynh", "phan", "vu", "vo", "dang", "bui", "do",
    "ho", "ngo", "duong", "ly", "dao", "dinh", "trinh", "mai", "truong", "lam", "cao", "ta",
    "ha", "luong", "doan", "thai", "chu", "kieu", "quach", "luu", "trieu", "vuong", "ton",
}
FREE_DOMAINS = {"gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "linkedin.com",
                "facebook.com", "bit.ly", "linktr.ee"}
NOISE_LINE = re.compile(
    r"^(•|·)?\s*(1st|2nd|3rd\+?|bậc \d|kết nối|connect|message|nhắn tin|follow|theo dõi|"
    r"view .*profile|xem hồ sơ.*|status is .*|đang hoạt động.*|current:.*|hiện tại:.*|"
    r"past:.*|trước đây:.*|\d+ (mutual|kết nối chung).*|.*mutual connection.*|"
    r".*followers|.*người theo dõi)$",
    re.I,
)


# ---------------------------------------------------------------- tiện ích

def fold(text):
    """Bỏ dấu tiếng Việt, chữ thường, để so khớp từ khóa."""
    text = (text or "").replace("đ", "d").replace("Đ", "D")
    text = unicodedata.normalize("NFKD", text)
    return "".join(c for c in text if not unicodedata.combining(c)).lower()


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def load_json(path, default):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def human_pause(lo=5, hi=15):
    time.sleep(random.uniform(lo, hi))


class Blocked(Exception):
    pass


# ---------------------------------------------------------------- trình duyệt

def open_context(p, headless):
    os.makedirs(PROFILE_DIR, exist_ok=True)
    return p.chromium.launch_persistent_context(
        PROFILE_DIR, channel="chrome", headless=headless,
        viewport={"width": 1366, "height": 860}, locale="vi-VN",
    )


def goto(page, url, debug=False, tag="page"):
    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(random.randint(2500, 4500))
    for _ in range(random.randint(2, 4)):
        page.mouse.wheel(0, random.randint(400, 900))
        page.wait_for_timeout(random.randint(600, 1400))
    cur = page.url
    if any(k in cur for k in ("/checkpoint", "/authwall", "/login", "/uas/")):
        raise Blocked(f"LinkedIn chuyển hướng tới {cur}. Cần đăng nhập lại hoặc xác minh thủ công.")
    if debug:
        os.makedirs(DEBUG_DIR, exist_ok=True)
        stamp = datetime.now().strftime("%H%M%S")
        with open(os.path.join(DEBUG_DIR, f"{stamp}_{tag}.html"), "w", encoding="utf-8") as f:
            f.write(page.content())
        page.screenshot(path=os.path.join(DEBUG_DIR, f"{stamp}_{tag}.png"))


def cmd_login(_args):
    # Mở Chrome thường (không qua Playwright) để "Đăng nhập bằng Google" không bị chặn.
    # Chrome chạy tách khỏi terminal (Ctrl+C không đóng nó); phiên lưu vào PROFILE_DIR.
    os.makedirs(PROFILE_DIR, exist_ok=True)
    subprocess.Popen([CHROME_BIN, f"--user-data-dir={PROFILE_DIR}", "--no-first-run",
                      "--no-default-browser-check", "https://www.linkedin.com/login"],
                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    print("[*] Đã mở cửa sổ Chrome riêng. Hãy tự đăng nhập tài khoản LinkedIn PHỤ trong đó.")
    print("[*] Khi thấy trang chủ (feed) LinkedIn: bấm vào cửa sổ Chrome đó và nhấn Cmd+Q.")
    print("[*] Sau đó chạy: .venv/bin/python scripts/linkedin_prospector.py check")


def profile_in_use():
    r = subprocess.run(["pgrep", "-f", f"user-data-dir={PROFILE_DIR}"], capture_output=True)
    return r.returncode == 0


def cmd_check(_args):
    if profile_in_use():
        sys.exit("[!] Chrome của hồ sơ LinkedIn đang mở. Thoát nó (Cmd+Q) rồi chạy lại.")
    with sync_playwright() as p:
        ctx = open_context(p, headless=True)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(3000)
        ok = "/feed" in page.url
        ctx.close()
    if ok:
        print("[SUCCESS] Đã đăng nhập. Phiên được lưu tại config/.browser_profile/linkedin")
    else:
        sys.exit("[!] Chưa thấy phiên đăng nhập LinkedIn. Hãy chạy lại lệnh login.")


# ---------------------------------------------------------------- trích xuất

SEARCH_JS = r"""
() => {
  const out = []; const seen = new Set();
  for (const a of document.querySelectorAll('main a[href*="/in/"]')) {
    const url = a.href.split('?')[0].replace(/\/$/, '');
    if (seen.has(url)) continue;
    const box = a.closest('li') || a.closest('[data-chameleon-result-urn]') || a.parentElement?.parentElement?.parentElement;
    if (!box) continue;
    const nameEl = a.querySelector('span[aria-hidden="true"]');
    const name = ((nameEl ? nameEl.innerText : a.innerText) || '').trim().split('\n')[0];
    if (!name || /LinkedIn Member|Thành viên LinkedIn/i.test(name)) continue;
    seen.add(url);
    out.push({url, name, text: box.innerText || ''});
  }
  return out;
}
"""

PROFILE_JS = r"""
() => {
  const main = document.querySelector('main') || document.body;
  const h1 = main.querySelector('h1');
  const anchor = document.querySelector('#experience');
  const exp = anchor ? (anchor.closest('section')?.innerText || '') : '';
  const companies = [...main.querySelectorAll('a[href*="/company/"]')]
    .map(a => ({href: a.href.split('?')[0], text: (a.innerText || '').trim()}));
  const headline = main.querySelector('.text-body-medium')?.innerText?.trim() || '';
  return {name: h1?.innerText?.trim() || '', headline, exp: exp.slice(0, 1500), companies};
}
"""


def parse_search_card(card):
    lines = [l.strip() for l in card["text"].split("\n") if l.strip()]
    lines = [l for l in lines if l != card["name"] and not NOISE_LINE.match(l)]
    headline = lines[0] if lines else ""
    location = lines[1] if len(lines) > 1 else ""
    return {"full_name": card["name"], "headline": headline, "location": location,
            "source_profile_url": card["url"]}


def parse_profile(data):
    exp_lines = [l.strip() for l in data["exp"].split("\n") if l.strip()]
    exp_lines = [l for l in exp_lines if fold(l) not in ("experience", "kinh nghiem")]
    job_title = exp_lines[0] if exp_lines else ""
    company_url, company_name = "", ""
    for c in data["companies"]:
        if re.search(r"/company/[^/]+/?$", c["href"]):
            company_url = c["href"].rstrip("/")
            company_name = c["text"].split("\n")[0] if c["text"] else ""
            if company_name:
                break
    if not company_name and len(exp_lines) > 1:
        company_name = re.split(r"\s+[·•]\s+", exp_lines[1])[0]
    return {"job_title": job_title or data["headline"], "company_name": company_name,
            "company_url": company_url, "headline": data["headline"]}


def field_after(lines, labels):
    for i, l in enumerate(lines):
        if fold(l) in labels and i + 1 < len(lines):
            return lines[i + 1]
    return ""


def fetch_company(page, company_url, cache, check_jobs, debug):
    slug = company_url.rstrip("/").split("/")[-1]
    if slug in cache:
        return cache[slug]
    human_pause()
    goto(page, company_url + "/about/", debug, f"company_{slug}")
    text = page.evaluate("() => (document.querySelector('main') || document.body).innerText")
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    info = {
        "linkedin_company_url": company_url,
        "name": page.evaluate("() => document.querySelector('h1')?.innerText?.trim() || ''"),
        "website": field_after(lines, {"website", "trang web"}),
        "industry": field_after(lines, {"industry", "nganh", "linh vuc"}),
        "company_size": field_after(lines, {"company size", "quy mo cong ty", "quy mo"}),
        "jobs_text": "",
        "checked_at": now_iso(),
    }
    if check_jobs:
        human_pause()
        goto(page, company_url + "/jobs/", debug, f"jobs_{slug}")
        info["jobs_text"] = page.evaluate(
            "() => (document.querySelector('main') || document.body).innerText")[:4000]
    cache[slug] = info
    save_json(COMPANY_CACHE_PATH, cache)
    return info


# ---------------------------------------------------------------- email

def domain_of(website):
    if not website:
        return ""
    if not website.startswith("http"):
        website = "http://" + website
    host = (urlparse(website).hostname or "").lower()
    host = host[4:] if host.startswith("www.") else host
    return "" if host in FREE_DOMAINS or "." not in host else host


def split_name(full_name):
    tokens = [t for t in re.split(r"[\s\-]+", fold(re.sub(r"\(.*?\)|,.*$", "", full_name))) if t.isalpha()]
    if len(tokens) < 2:
        return None
    if tokens[0] in VN_SURNAMES:            # Nguyễn Văn An
        return {"given": tokens[-1], "family": tokens[0], "middle": tokens[1:-1]}
    if tokens[-1] in VN_SURNAMES:           # An Nguyễn
        return {"given": tokens[0], "family": tokens[-1], "middle": tokens[1:-1]}
    return {"given": tokens[0], "family": tokens[-1], "middle": tokens[1:-1]}


def guess_emails(full_name, domain):
    n = split_name(full_name)
    if not n or not domain:
        return []
    g, f = n["given"], n["family"]
    initials = f[0] + "".join(m[0] for m in n["middle"])
    cands = [f"{g}.{f}", f"{g}{initials}", f"{g}{f}", f"{g}", f"{f}.{g}", f"{g}.{initials}"]
    out = []
    for c in cands:
        e = f"{c}@{domain}"
        if e not in out:
            out.append(e)
    return out


def has_mx(domain, _cache={}):
    if domain in _cache:
        return _cache[domain]
    try:
        import dns.resolver
        ok = len(dns.resolver.resolve(domain, "MX", lifetime=8)) > 0
    except Exception:
        ok = False
    _cache[domain] = ok
    return ok


# ---------------------------------------------------------------- chấm điểm

def parse_size(text):
    nums = [int(x.replace(",", "").replace(".", "")) for x in re.findall(r"\d[\d,\.]*", text or "")]
    if not nums:
        return None
    return (nums[0], nums[1]) if len(nums) > 1 else (nums[0], nums[0] * 10)


def any_kw(text, kws):
    t = fold(text)
    return [k for k in kws if k in t]


def score_lead(lead, icp):
    kw = icp["scoring_keywords"]
    w = icp["scoring_weights"]
    b = {}
    b["title_match"] = w["title_match"] if any_kw(lead["job_title"] + " " + lead["headline"], kw["title"]) else 0
    b["industry_match"] = w["industry_match"] if any_kw(
        lead["industry"] + " " + lead["company_name"] + " " + lead["headline"], kw["industry"]) else 0
    lo, hi = icp["company_size"]["min_employees"], icp["company_size"]["max_employees"]
    rng = parse_size(lead["company_size"])
    if rng and lo <= rng[0] and rng[1] <= hi:
        b["company_size_match"] = w["company_size_match"]
    elif rng and rng[0] <= hi and rng[1] >= lo:
        b["company_size_match"] = w["company_size_match"] // 2
    else:
        b["company_size_match"] = 0
    signals = []
    jobs = lead.pop("_jobs_text", "")
    if jobs and any_kw(jobs, kw["intent_job"]):
        signals.append("Đang tuyển vị trí liên quan: " + ", ".join(any_kw(jobs, kw["intent_job"])[:4]))
    elif re.search(r"\b[1-9]\d*\s+(job|jobs|việc làm|viec lam)\b", fold(jobs)):
        signals.append("Công ty đang có tin tuyển dụng")
    if any_kw(lead["headline"], ["hiring", "dang tuyen", "we're hiring", "tuyen dung"]):
        signals.append("Headline nhắc tới tuyển dụng")
    intent = 0
    if signals and signals[0].startswith("Đang tuyển"):
        intent = w["intent_signal_match"]
    elif signals:
        intent = w["intent_signal_match"] * 2 // 5
    b["intent_signal_match"] = intent
    contact = 0
    if lead["website"]:
        contact += w["contact_data_quality"] // 2
    if lead["email_status"] == "pattern_guess_mx_ok":
        contact += w["contact_data_quality"] - w["contact_data_quality"] // 2
    b["contact_data_quality"] = contact
    total = sum(b.values())
    tier = "Hot" if total >= HOT_MIN else "Warm" if total >= QUALIFIED_MIN else "Disqualified"
    return total, tier, b, signals


def exclusion_reason(lead, icp):
    kw = icp["scoring_keywords"]
    hit = any_kw(lead["company_name"] + " " + lead["website"], kw["exclude_company"])
    if hit:
        return "Loại trừ: công ty thuộc danh sách " + hit[0]
    hit = any_kw(lead["industry"], kw["exclude_industry"])
    if hit:
        return "Loại trừ: ngành " + lead["industry"]
    return ""


# ---------------------------------------------------------------- chạy

def cmd_run(args):
    if profile_in_use():
        sys.exit("[!] Chrome của hồ sơ LinkedIn đang mở. Thoát nó (Cmd+Q) rồi chạy lại.")
    icp_all = load_json(ICP_PATH, None)
    if not icp_all:
        sys.exit("[!] Chưa có outputs/01_icp_criteria/icp_criteria.json")
    icp = icp_all["campaigns"][CAMPAIGN_INDEX[args.campaign]]
    business = load_json(BUSINESS_PATH, {})
    target = args.target or business.get("campaign", {}).get("daily_qualified_lead_target") or 10
    search = icp["linkedin_search"]

    leads = load_json(LEADS_PATH, [])
    seen_urls = {l.get("source_profile_url") for l in leads}
    seen_emails = {l.get("email") for l in leads if l.get("email")}
    seen_name_domain = {(fold(l.get("full_name")), domain_of(l.get("website"))) for l in leads}
    cache = load_json(COMPANY_CACHE_PATH, {})

    queries = list(search["queries"])
    random.shuffle(queries)
    new_leads, qualified, profile_views = [], 0, 0
    print(f"[*] Chiến dịch {icp['campaign_name']} | mục tiêu {target} lead đạt chuẩn | "
          f"tối đa {args.max_profiles} hồ sơ")

    with sync_playwright() as p:
        ctx = open_context(p, headless=args.headless)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            for q in queries:
                if qualified >= target or profile_views >= args.max_profiles:
                    break
                for pg_no in range(1, args.pages_per_query + 1):
                    url = (f"https://www.linkedin.com/search/results/people/?keywords={quote(q)}"
                           f"&geoUrn=%5B%22{search['geo_urn']}%22%5D&origin=FACETED_SEARCH&page={pg_no}")
                    human_pause()
                    goto(page, url, args.debug, "search")
                    cards = [parse_search_card(c) for c in page.evaluate(SEARCH_JS)]
                    print(f"[+] '{q}' trang {pg_no}: {len(cards)} kết quả")
                    if args.dry_run:
                        for c in cards:
                            print(f"    - {c['full_name']} | {c['headline']} | {c['location']}")
                        continue
                    if not cards:
                        break
                    for c in cards:
                        if qualified >= target or profile_views >= args.max_profiles:
                            break
                        if c["source_profile_url"] in seen_urls:
                            continue
                        if not any_kw(c["headline"], icp["scoring_keywords"]["title"]):
                            continue  # tiết kiệm lượt xem: bỏ qua người không đúng chức danh
                        seen_urls.add(c["source_profile_url"])
                        human_pause()
                        goto(page, c["source_profile_url"], args.debug, "profile")
                        profile_views += 1
                        prof = parse_profile(page.evaluate(PROFILE_JS))
                        comp = {}
                        if prof["company_url"]:
                            comp = fetch_company(page, prof["company_url"], cache,
                                                 not args.no_jobs, args.debug)
                        website = comp.get("website", "")
                        domain = domain_of(website)
                        lead = {
                            "id": f"li_{int(time.time())}_{profile_views}",
                            "campaign": icp["campaign_name"],
                            "full_name": c["full_name"],
                            "job_title": prof["job_title"],
                            "headline": prof["headline"] or c["headline"],
                            "company_name": comp.get("name") or prof["company_name"],
                            "company_size": comp.get("company_size", ""),
                            "industry": comp.get("industry", ""),
                            "website": website,
                            "email": "",
                            "email_candidates": [],
                            "email_status": "no_domain",
                            "phone": "",
                            "location": c["location"],
                            "source": "LinkedIn",
                            "source_profile_url": c["source_profile_url"],
                            "source_company_url": prof["company_url"],
                            "search_query": q,
                            "collected_at": now_iso(),
                            "created_at": now_iso(),
                            "_jobs_text": comp.get("jobs_text", ""),
                        }
                        if domain:
                            cands = guess_emails(c["full_name"], domain)
                            lead["email_candidates"] = cands
                            if cands and has_mx(domain):
                                lead["email"], lead["email_status"] = cands[0], "pattern_guess_mx_ok"
                            else:
                                lead["email_status"] = "no_mx" if cands else "name_unparsed"
                        key = (fold(lead["full_name"]), domain)
                        if (lead["email"] and lead["email"] in seen_emails) or (domain and key in seen_name_domain):
                            continue
                        reason = exclusion_reason(lead, icp)
                        total, tier, breakdown, signals = score_lead(lead, icp)
                        if reason:
                            total, tier = 0, "Disqualified"
                        lead.update({"icp_score": total, "icp_tier": tier, "score_breakdown": breakdown,
                                     "intent_signals": signals, "exclusion_reason": reason})
                        new_leads.append(lead)
                        seen_emails.add(lead["email"])
                        seen_name_domain.add(key)
                        if tier != "Disqualified":
                            qualified += 1
                        print(f"    [{tier} {total}] {lead['full_name']} - {lead['job_title']} @ {lead['company_name']}")
                        save_json(LEADS_PATH, leads + new_leads)
        except Blocked as e:
            print(f"[STOP] {e}")
        finally:
            ctx.close()

    if args.dry_run:
        print("[DRY-RUN] Không ghi dữ liệu.")
        return
    print(f"\n[SUCCESS] {len(new_leads)} lead mới ({qualified} đạt chuẩn ≥{QUALIFIED_MIN}), "
          f"{profile_views} hồ sơ đã xem. Lưu tại {os.path.relpath(LEADS_PATH, ROOT)}")
    if qualified < target:
        print(f"[!] Chưa đạt mục tiêu {target}: chỉ có {qualified} lead đạt chuẩn trong lần chạy này.")
    top = sorted((l for l in new_leads if l["icp_tier"] != "Disqualified"),
                 key=lambda l: -l["icp_score"])[:5]
    if top:
        print("\nTop 5 lead ưu tiên:")
        for l in top:
            print(f"  {l['icp_score']:>3} | {l['full_name']} | {l['job_title']} | {l['company_name']} | "
                  f"{l['email'] or l['email_status']}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("login", help="Mở Chrome để bạn tự đăng nhập tài khoản LinkedIn phụ")
    sub.add_parser("check", help="Kiểm tra phiên đăng nhập LinkedIn đã lưu")
    r = sub.add_parser("run", help="Tìm và chấm điểm lead")
    r.add_argument("--campaign", choices=["A", "B"], required=True)
    r.add_argument("--target", type=int, help="Số lead đạt chuẩn cần tìm (mặc định lấy từ business.json)")
    r.add_argument("--max-profiles", type=int, default=25, help="Giới hạn số hồ sơ xem mỗi lần chạy")
    r.add_argument("--pages-per-query", type=int, default=2)
    r.add_argument("--no-jobs", action="store_true", help="Không xem trang tuyển dụng của công ty")
    r.add_argument("--dry-run", action="store_true", help="Chỉ đọc trang kết quả tìm kiếm, không ghi file")
    r.add_argument("--headless", action="store_true")
    r.add_argument("--debug", action="store_true", help="Lưu HTML + ảnh chụp từng trang vào debug/")
    args = ap.parse_args()
    {"login": cmd_login, "check": cmd_check, "run": cmd_run}[args.cmd](args)


if __name__ == "__main__":
    main()
