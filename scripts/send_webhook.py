#!/usr/bin/env python3
"""
Tiện ích gửi dữ liệu Lead hoặc Task sang CRM Webhook
Sử dụng: python3 send_webhook.py --type lead|task --file payload.json
"""

import sys
import os
import json
import argparse
import urllib.request
import urllib.error

def send_webhook(url, payload, token=None):
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Claude-CRM-Workflow/1.0"
    }
    if token:
        headers["Authorization"] = token

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            status_code = response.getcode()
            response_body = response.read().decode("utf-8")
            print(f"[SUCCESS] Webhook phản hồi status: {status_code}")
            print(f"[RESPONSE]: {response_body}")
            return True
    except urllib.error.HTTPError as e:
        print(f"[ERROR] HTTP Error {e.code}: {e.read().decode('utf-8')}", file=sys.stderr)
        return False
    except urllib.error.URLError as e:
        print(f"[ERROR] URL Error: {e.reason}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Gửi dữ liệu webhook lên CRM")
    parser.add_argument("--url", required=True, help="Webhook URL của CRM")
    parser.add_argument("--token", default=None, help="Authorization Token (tùy chọn)")
    parser.add_argument("--file", required=True, help="Đường dẫn file JSON chứa payload")
    
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"[ERROR] Không tìm thấy file: {args.file}", file=sys.stderr)
        sys.exit(1)

    with open(args.file, "r", encoding="utf-8") as f:
        payload = json.load(f)

    print(f"[*] Đang gửi dữ liệu từ {args.file} tới {args.url}...")
    success = send_webhook(args.url, payload, args.token)
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
