#!/bin/sh
# headersHelper for the TinaCRM MCP server: reads the API key from a local, gitignored file
# and prints the Authorization header as JSON. The key never appears in .mcp.json or chat.
key_file="$(dirname "$0")/../config/tinacrm_api_key.txt"
if [ ! -s "$key_file" ]; then
  echo "Missing TinaCRM API key in config/tinacrm_api_key.txt" >&2
  exit 1
fi
key=$(tr -d ' \r\n' < "$key_file")
printf '{"Authorization":"Bearer %s"}' "$key"
