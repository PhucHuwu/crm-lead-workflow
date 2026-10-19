#!/bin/sh
# Shows a macOS dialog where the user pastes the TinaCRM API key, saves it to
# config/tinacrm_api_key.txt (gitignored) and, if an MCP URL is given, checks that
# TinaCRM accepts it. The key is never printed, so it stays out of the chat.
# Usage: sh scripts/tinacrm_save_key.sh [https://<server>/mcp]
dir="$(cd "$(dirname "$0")/.." && pwd)"
key_file="$dir/config/tinacrm_api_key.txt"
mcp_url="$1"

key=$(osascript \
  -e 'activate' \
  -e 'text returned of (display dialog "Dán API key TinaCRM vào ô dưới rồi bấm Lưu." default answer "" with hidden answer with title "Kết nối TinaCRM" buttons {"Hủy", "Lưu"} default button "Lưu" cancel button "Hủy")' \
  2>/dev/null) || { echo "Đã hủy, chưa lưu khóa."; exit 1; }
key=$(printf %s "$key" | tr -d ' \r\n')
[ -n "$key" ] || { echo "Ô trống, chưa lưu khóa."; exit 1; }

umask 077
printf '%s\n' "$key" > "$key_file"
echo "Đã lưu khóa vào config/tinacrm_api_key.txt."

[ -n "$mcp_url" ] || exit 0
code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 -X POST "$mcp_url" \
  -H "Authorization: Bearer $key" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"crm-lead-workflow","version":"1"}}}')
case "$code" in
  200) echo "TinaCRM chấp nhận khóa." ;;
  401|403) echo "TinaCRM từ chối khóa (HTTP $code): khóa sai, hết hạn hoặc đã xóa."; exit 2 ;;
  *) echo "Không kiểm tra được khóa (HTTP $code): xem lại địa chỉ MCP."; exit 3 ;;
esac
