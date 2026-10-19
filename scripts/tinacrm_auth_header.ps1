# headersHelper for the TinaCRM MCP server on Windows: reads the API key from the local,
# gitignored config\tinacrm_api_key.txt and prints the Authorization header as JSON.
$keyFile = Join-Path $PSScriptRoot '..\config\tinacrm_api_key.txt'
if (-not (Test-Path $keyFile)) {
  [Console]::Error.WriteLine('Missing TinaCRM API key in config\tinacrm_api_key.txt')
  exit 1
}
$key = ((Get-Content -Raw $keyFile) -replace '\s', '')
if (-not $key) {
  [Console]::Error.WriteLine('Empty TinaCRM API key in config\tinacrm_api_key.txt')
  exit 1
}
@{ Authorization = "Bearer $key" } | ConvertTo-Json -Compress
