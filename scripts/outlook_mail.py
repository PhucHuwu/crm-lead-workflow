#!/usr/bin/env python3
"""Send and read email through the Outlook app already signed in on this computer.

No connector, no password, no install. Needs **classic Outlook** (Mac: "Legacy Outlook";
Windows: "Outlook (classic)"); the new Outlook cannot be controlled by scripts.
  python3 scripts/outlook_mail.py check
  python3 scripts/outlook_mail.py draft --to a@b.com --subject "..." --body-file body.txt [--cc ...] [--html]
  python3 scripts/outlook_mail.py send  --to a@b.com --subject "..." --body-file body.txt [--cc ...] [--html] --confirm
  python3 scripts/outlook_mail.py replies [--days 7]
  python3 scripts/outlook_mail.py eml --to a@b.com --subject "..." --body-file body.txt --out <file.eml> [--no-open]

draft  : opens a ready-to-send email window in Outlook (saved in Drafts); the user clicks Send.
send   : sends from the default Outlook account; refuses without --confirm.
replies: inbox messages received in the last N days (sender address, subject, time).
eml    : fallback without Outlook automation: writes an unsent .eml file and opens it in the
         default mail app; the user clicks Send.
Output: one JSON object {"ok": true, ...} or {"ok": false, "error": ..., "fix"?: ...}.
"""
import argparse
import html
import json
import os
import platform
import subprocess
import sys
import tempfile
from email.message import EmailMessage

MAC_APP = "/Applications/Microsoft Outlook.app"
SWITCH_MAC = ("Mở Outlook, trên thanh menu bấm Outlook rồi bỏ chọn “New Outlook” "
              "(bản mới hơn: Help → Legacy Outlook). Outlook khởi động lại ở bản cũ, rồi chạy lại lệnh.")
SWITCH_WIN = ("Trong Outlook mới, bật nút “New Outlook” ở góc trên bên phải về Off "
              "(hoặc mở “Outlook (classic)” từ Start). Chưa có bản classic thì cài Microsoft 365 Apps "
              "hoặc nhờ IT cài “Outlook (classic)”.")


class Fail(Exception):
    def __init__(self, error, fix=None):
        super().__init__(error)
        self.error, self.fix = error, fix


def body_html(path, is_html):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if is_html:
        return text, None
    escaped = html.escape(text).replace("\n", "<br>\n")
    return f'<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt">{escaped}</div>', text


def addresses(value):
    items = [a.strip() for a in (value or "").replace(";", ",").split(",") if a.strip()]
    for a in items:
        if "@" not in a or " " in a:
            raise Fail(f"Địa chỉ email không hợp lệ: {a}")
    return items


# ---------- macOS (AppleScript, classic Outlook) ----------

MAC_SCRIPT = r'''
on splitText(t, d)
  if t is "" then return {}
  set AppleScript's text item delimiters to d
  set parts to text items of t
  set AppleScript's text item delimiters to ""
  return parts
end splitText

on clean(t)
  set AppleScript's text item delimiters to {tab, return, linefeed}
  set parts to text items of t
  set AppleScript's text item delimiters to " "
  set t to parts as text
  set AppleScript's text item delimiters to ""
  return t
end clean

on run argv
  set action to item 1 of argv
  tell application "Microsoft Outlook"
    if action is "check" then
      set addr to ""
      try
        set addr to email address of default account
      end try
      return "OK" & tab & addr
    else if action is "replies" then
      set since to (current date) - ((item 2 of argv) as integer) * days
      set out to "OK" & linefeed
      set msgs to (messages of inbox whose time received ≥ since)
      repeat with m in msgs
        set addr to ""
        try
          set addr to address of (sender of m)
        end try
        set subj to ""
        try
          set subj to my clean(subject of m)
        end try
        set out to out & addr & tab & subj & tab & ((time received of m) as «class isot» as string) & linefeed
      end repeat
      return out
    else
      set m to make new outgoing message with properties {subject:(item 4 of argv), content:(item 5 of argv)}
      repeat with a in my splitText(item 2 of argv, ",")
        make new recipient at m with properties {email address:{address:(a as text)}}
      end repeat
      repeat with a in my splitText(item 3 of argv, ",")
        make new cc recipient at m with properties {email address:{address:(a as text)}}
      end repeat
      if action is "send" then
        send m
      else
        open m
        activate
      end if
      return "OK"
    end if
  end tell
end run
'''


def mac_new_outlook():
    r = subprocess.run(["defaults", "read", "com.microsoft.Outlook", "IsRunningNewOutlook"],
                       capture_output=True, text=True)
    return r.stdout.strip() == "1"


def mac_run(argv):
    if not os.path.exists(MAC_APP):
        raise Fail("Máy chưa cài ứng dụng Microsoft Outlook.",
                   "Cài Outlook (Microsoft 365) rồi đăng nhập hộp thư, hoặc dùng lệnh eml.")
    if mac_new_outlook():
        raise Fail("Outlook đang ở bản mới (New Outlook), bản này không cho trợ lý điều khiển.", SWITCH_MAC)
    r = subprocess.run(["osascript", "-", *argv], input=MAC_SCRIPT, capture_output=True, text=True, timeout=180)
    if r.returncode != 0:
        err = r.stderr.strip()
        if "-1743" in err or "Not authorized" in err:
            raise Fail("macOS chưa cho phép trợ lý điều khiển Outlook.",
                       "Khi máy hỏi “… muốn điều khiển Microsoft Outlook” thì bấm OK. Đã lỡ bấm Không: "
                       "System Settings → Privacy & Security → Automation → bật Microsoft Outlook "
                       "cho ứng dụng trợ lý (Claude hoặc ChatGPT), rồi chạy lại.")
        if mac_new_outlook():
            raise Fail("Outlook đang ở bản mới (New Outlook), bản này không cho trợ lý điều khiển.", SWITCH_MAC)
        raise Fail(f"Outlook báo lỗi: {err[-300:]}",
                   "Mở Outlook, kiểm tra đã đăng nhập hộp thư, rồi chạy lại. Vẫn lỗi thì dùng lệnh eml.")
    return r.stdout


# ---------- Windows (COM, classic Outlook) ----------

WIN_SCRIPT = r'''
param([string]$ArgsFile)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$a = Get-Content -Raw -Encoding UTF8 $ArgsFile | ConvertFrom-Json
try { $o = New-Object -ComObject Outlook.Application } catch {
  Write-Output (@{ ok = $false; error = 'no_classic' } | ConvertTo-Json -Compress); exit 0 }
$ns = $o.GetNamespace('MAPI')
if ($a.action -eq 'check') {
  $acc = @($ns.Accounts | ForEach-Object { $_.SmtpAddress })
  $r = @{ ok = $true; accounts = $acc }
} elseif ($a.action -eq 'replies') {
  $since = (Get-Date).AddDays(-[int]$a.days)
  $items = $ns.GetDefaultFolder(6).Items
  $items.Sort('[ReceivedTime]', $true)
  $list = @()
  foreach ($i in $items) {
    if ($i.Class -ne 43) { continue }
    if ($i.ReceivedTime -lt $since) { break }
    $addr = $i.SenderEmailAddress
    if ($i.SenderEmailType -eq 'EX') { try { $addr = $i.Sender.GetExchangeUser().PrimarySmtpAddress } catch {} }
    $list += @{ from = $addr; subject = $i.Subject; received = $i.ReceivedTime.ToString('s') }
  }
  $r = @{ ok = $true; messages = $list }
} else {
  $m = $o.CreateItem(0)
  $m.To = $a.to
  if ($a.cc) { $m.CC = $a.cc }
  $m.Subject = $a.subject
  $m.HTMLBody = $a.html
  if ($a.action -eq 'send') { $m.Send() } else { $m.Save(); $m.Display() }
  $r = @{ ok = $true }
}
Write-Output ($r | ConvertTo-Json -Compress -Depth 4)
'''


def win_run(payload):
    with tempfile.TemporaryDirectory() as d:
        ps, js = os.path.join(d, "outlook.ps1"), os.path.join(d, "args.json")
        with open(ps, "w", encoding="utf-8-sig") as f:
            f.write(WIN_SCRIPT)
        with open(js, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        r = subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps, js],
                           capture_output=True, timeout=180)
    out = r.stdout.decode("utf-8", errors="replace").strip()
    try:
        data = json.loads(out.splitlines()[-1])
    except (ValueError, IndexError):
        err = (r.stderr.decode("utf-8", errors="replace") or out).strip()
        raise Fail(f"Outlook báo lỗi: {err[-300:]}",
                   "Mở Outlook (classic), kiểm tra đã đăng nhập hộp thư, rồi chạy lại. Nếu Outlook hiện hộp "
                   "thoại “A program is trying to send…” thì bấm Allow. Vẫn lỗi thì dùng lệnh eml.")
    if data.get("error") == "no_classic":
        raise Fail("Máy chưa có Outlook bản cổ điển (classic), bản mới không cho trợ lý điều khiển.", SWITCH_WIN)
    return data


# ---------- commands ----------

def run_outlook(action, a=None):
    system = platform.system()
    if system not in ("Darwin", "Windows"):
        raise Fail("Chỉ hỗ trợ macOS và Windows.", "Dùng lệnh eml.")
    payload = {"action": action}
    if action in ("send", "draft"):
        to, cc = addresses(a.to), addresses(a.cc)
        if not to:
            raise Fail("Thiếu người nhận (--to).")
        html_body, _ = body_html(a.body_file, a.html)
        payload.update(to="; ".join(to), cc="; ".join(cc), subject=a.subject, html=html_body)
    if action == "replies":
        payload["days"] = a.days
    if system == "Windows":
        return win_run(payload)
    if action == "check":
        _, _, addr = mac_run(["check"]).strip().partition("\t")
        return {"ok": True, "accounts": [addr] if addr else []}
    if action == "replies":
        lines = mac_run(["replies", str(a.days)]).strip().splitlines()[1:]
        msgs = []
        for line in lines:
            sender, _, rest = line.partition("\t")
            subject, _, received = rest.rpartition("\t")
            msgs.append({"from": sender, "subject": subject, "received": received})
        return {"ok": True, "messages": msgs}
    mac_run([action, ",".join(payload["to"].split("; ")), ",".join(filter(None, payload["cc"].split("; "))),
             payload["subject"], payload["html"]])
    return {"ok": True}


def make_eml(a):
    to, cc = addresses(a.to), addresses(a.cc)
    if not to:
        raise Fail("Thiếu người nhận (--to).")
    html_body, text = body_html(a.body_file, a.html)
    msg = EmailMessage()
    msg["To"] = ", ".join(to)
    if cc:
        msg["Cc"] = ", ".join(cc)
    msg["Subject"] = a.subject
    msg["X-Unsent"] = "1"
    msg.set_content(text if text is not None else "Xem nội dung dạng HTML.")
    msg.add_alternative(html_body, subtype="html")
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "wb") as f:
        f.write(bytes(msg))
    if not a.no_open:
        if platform.system() == "Darwin":
            subprocess.run(["open", a.out], check=False)
        elif platform.system() == "Windows":
            os.startfile(a.out)  # noqa: S606 - opens the user's own mail app
    return {"ok": True, "file": a.out, "opened": not a.no_open}


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check")
    r = sub.add_parser("replies")
    r.add_argument("--days", type=int, default=7)
    for name in ("draft", "send", "eml"):
        s = sub.add_parser(name)
        s.add_argument("--to", required=True)
        s.add_argument("--cc", default="")
        s.add_argument("--subject", required=True)
        s.add_argument("--body-file", required=True)
        s.add_argument("--html", action="store_true")
        if name == "send":
            s.add_argument("--confirm", action="store_true")
        if name == "eml":
            s.add_argument("--out", required=True)
            s.add_argument("--no-open", action="store_true")
    a = p.parse_args()
    if a.cmd == "send" and not a.confirm:
        raise Fail("Chưa gửi: lệnh send cần --confirm sau khi người dùng đã duyệt nội dung và người nhận.")
    if a.cmd == "eml":
        return make_eml(a)
    return run_outlook(a.cmd, a)


if __name__ == "__main__":
    try:
        result = main()
    except Fail as e:
        out = {"ok": False, "error": e.error}
        if e.fix:
            out["fix"] = e.fix
        print(json.dumps(out, ensure_ascii=False))
        sys.exit(1)
    except (OSError, subprocess.TimeoutExpired) as e:
        print(json.dumps({"ok": False, "error": f"Không chạy được: {e}"}, ensure_ascii=False))
        sys.exit(1)
    print(json.dumps(result, ensure_ascii=False))
