# Windows version of update_workflow.sh: updates a workflow folder (downloaded as ZIP, no git
# needed) to the latest version on GitHub. Business data is never overwritten: inputs/, outputs/,
# campaigns/, config/business.json, progress files, product-marketing.md, .mcp.json, the API key
# and browser profiles. Workflow files the user edited are backed up to
# .local/workflow-backups/<time>/ before being replaced; files removed upstream are moved there too.
#
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\update_workflow.ps1 [-Check] [-Force] [target_folder]
# Old folders without this script (run in PowerShell inside the workflow folder):
#   $f="$env:TEMP\update_workflow.ps1"; iwr https://raw.githubusercontent.com/PhucHuwu/crm-lead-workflow/main/scripts/update_workflow.ps1 -OutFile $f; powershell -NoProfile -ExecutionPolicy Bypass -File $f (Get-Location).Path
#
# Output: one "changed: <path>" line per added/updated/removed file (also saved to
# .local/workflow-last-update.txt), then a last line
# status=<up_to_date|update_available|updated|busy|error> ...
# busy: another update is running in this folder right now.
param([switch]$Check, [switch]$Force, [string]$Target = '')
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'

$repo = if ($env:WORKFLOW_REPO) { $env:WORKFLOW_REPO } else { 'PhucHuwu/crm-lead-workflow' }
$branch = if ($env:WORKFLOW_BRANCH) { $env:WORKFLOW_BRANCH } else { 'main' }
$zipUrl = if ($env:WORKFLOW_ZIP_URL) { $env:WORKFLOW_ZIP_URL } else { "https://codeload.github.com/$repo/zip/refs/heads/$branch" }

function Die($msg) { Write-Output "status=error message=`"$msg`""; exit 1 }
function Short($s) { if ($s) { $s.Substring(0, [Math]::Min(7, $s.Length)) } else { 'unknown' } }

if (-not $Target) {
  $candidate = Join-Path $PSScriptRoot '..'
  $Target = if (Test-Path (Join-Path $candidate 'CLAUDE.md')) { $candidate } else { (Get-Location).Path }
}
if (-not (Test-Path $Target -PathType Container)) { Die "Không tìm thấy thư mục $Target" }
$Target = (Resolve-Path $Target).Path
if (-not (Test-Path (Join-Path $Target 'CLAUDE.md')) -or -not (Test-Path (Join-Path $Target 'workflows'))) {
  Die "Thư mục $Target không phải thư mục workflow"
}
if ((Test-Path (Join-Path $Target '.git')) -and -not $env:WORKFLOW_ALLOW_GIT) {
  Die 'Thư mục này là bản git; dùng git pull thay cho script cập nhật'
}

$versionFile = Join-Path $Target '.workflow-version'
$manifestFile = Join-Path $Target '.workflow-manifest'
$current = if (Test-Path $versionFile) { (Get-Content $versionFile -Raw).Trim() } else { '' }

$latest = $env:WORKFLOW_SHA
if (-not $latest) {
  try {
    $latest = (Invoke-WebRequest -UseBasicParsing -TimeoutSec 30 -Headers @{ Accept = 'application/vnd.github.sha' } `
      "https://api.github.com/repos/$repo/commits/$branch").Content.Trim()
  } catch { $latest = '' }
}
if ($latest -notmatch '^[0-9a-f]+$') { $latest = '' }

if ($latest -and $latest -eq $current -and -not $Force) {
  Write-Output "status=up_to_date version=$(Short $current)"; exit 0
}
if ($Check) {
  Write-Output "status=update_available current=$(Short $current) latest=$(Short $latest)"; exit 0
}

# One update at a time per folder: scheduled runs of several campaigns may start close together.
# A lock older than 15 minutes is left over from a crashed run and is taken over.
$localDir = Join-Path $Target '.local'
New-Item -ItemType Directory -Force -Path $localDir | Out-Null
$lock = Join-Path $localDir 'workflow-update.lock'
if (Test-Path $lock) {
  if ((Get-Item $lock).LastWriteTime -lt (Get-Date).AddMinutes(-15)) { Remove-Item -Recurse -Force $lock }
  else { Write-Output 'status=busy'; exit 0 }
}
try { New-Item -ItemType Directory -Path $lock -ErrorAction Stop | Out-Null } catch { Write-Output 'status=busy'; exit 0 }

$tmp = Join-Path ([IO.Path]::GetTempPath()) ("wf-update-" + [Guid]::NewGuid())
New-Item -ItemType Directory -Path $tmp | Out-Null
$changed = New-Object System.Collections.Generic.List[string]
try {
  $zip = Join-Path $tmp 'workflow.zip'
  try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 300 -OutFile $zip $zipUrl } catch { Die 'Không tải được bản mới từ GitHub' }
  try { Expand-Archive -Path $zip -DestinationPath (Join-Path $tmp 'x') } catch { Die 'Tệp tải về bị lỗi' }
  $src = (Get-ChildItem (Join-Path $tmp 'x') -Directory | Select-Object -First 1).FullName
  if (-not (Test-Path (Join-Path $src 'CLAUDE.md')) -or -not (Test-Path (Join-Path $src 'scripts\update_workflow.sh'))) {
    Die 'Bản tải về không đúng cấu trúc workflow'
  }

  $protected = @('^inputs/', '^outputs/', '^campaigns/', '^\.local/', '^\.venv/', '^\.venv-browser/', '^config/\.browser_profile/',
    '^config/business\.json$', '^config/workflow_progress\.md$', '^config/tinacrm_api_key\.txt$',
    '^product-marketing\.md$', '^\.mcp\.json$', '^CLAUDE\.local\.md$', '^\.claude/settings\.local\.json$',
    '^\.env$', '^\.env\.', '^config/\.env$', '^config/\.env\.', '^\.workflow-version$', '^\.workflow-manifest$')
  function IsProtected($rel) { foreach ($p in $protected) { if ($rel -match $p) { return $true } }; return $false }
  function HashOf($path) { (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLower() }

  $oldHashes = @{}
  if (Test-Path $manifestFile) {
    foreach ($line in Get-Content $manifestFile -Encoding UTF8) {
      if ($line.Length -gt 66) { $oldHashes[$line.Substring(66)] = $line.Substring(0, 64) }
    }
  }

  $backup = Join-Path $Target ('.local\workflow-backups\' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
  function BackupFile($rel, [switch]$Move) {
    $dest = Join-Path $backup $rel
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    if ($Move) { Move-Item -LiteralPath (Join-Path $Target $rel) -Destination $dest -Force }
    else { Copy-Item -LiteralPath (Join-Path $Target $rel) -Destination $dest -Force }
  }
  function InstallFile($rel) {
    $dest = Join-Path $Target $rel
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    Copy-Item -LiteralPath (Join-Path $src $rel) -Destination "$dest.update-tmp" -Force
    Move-Item -LiteralPath "$dest.update-tmp" -Destination $dest -Force
  }

  # web-docs/ is the guide website, not part of the workflow a business runs.
  $files = Get-ChildItem -LiteralPath $src -Recurse -File -Force | ForEach-Object {
    $_.FullName.Substring($src.Length + 1).Replace('\', '/')
  } | Where-Object { $_ -notmatch '^web-docs/' } | Sort-Object

  $added = 0; $updated = 0; $removed = 0
  $manifest = New-Object System.Collections.Generic.List[string]
  foreach ($rel in $files) {
    $newHash = HashOf (Join-Path $src $rel)
    $manifest.Add("$newHash  $rel")
    $dest = Join-Path $Target $rel
    if (Test-Path -LiteralPath $dest) {
      if (IsProtected $rel) { continue }
      $curHash = HashOf $dest
      if ($curHash -eq $newHash) { continue }
      if ($oldHashes[$rel] -ne $curHash) { BackupFile $rel }
      InstallFile $rel
      $updated++
    } else {
      InstallFile $rel
      $added++
    }
    $changed.Add($rel)
  }

  $newSet = @{}; foreach ($rel in $files) { $newSet[$rel] = $true }
  foreach ($rel in $oldHashes.Keys) {
    if ($newSet.ContainsKey($rel) -or (IsProtected $rel)) { continue }
    if (Test-Path -LiteralPath (Join-Path $Target $rel) -PathType Leaf) { BackupFile $rel -Move; $removed++; $changed.Add("$rel (removed)") }
  }

  [IO.File]::WriteAllLines($manifestFile, $manifest, (New-Object System.Text.UTF8Encoding($false)))
  if ($latest) { [IO.File]::WriteAllText($versionFile, "$latest`n") }

  # Claude re-reads these files after an update instead of relying on the old session context.
  [IO.File]::WriteAllLines((Join-Path $localDir 'workflow-last-update.txt'), $changed, (New-Object System.Text.UTF8Encoding($false)))
  foreach ($rel in $changed) { Write-Output "changed: $rel" }

  $backupRel = if (Test-Path $backup) { $backup.Substring($Target.Length + 1).Replace('\', '/') } else { '' }
  Write-Output "status=updated version=$(Short $latest) added=$added updated=$updated removed=$removed backup=$backupRel"
} finally {
  Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
  Remove-Item -Recurse -Force $lock -ErrorAction SilentlyContinue
}
