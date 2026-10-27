#!/bin/sh
# Updates a workflow folder (downloaded as ZIP, no git needed) to the latest version on GitHub.
# Business data is never overwritten: inputs/, outputs/, campaigns/, config/business.json,
# progress files, product-marketing.md, .mcp.json, .codex/config.toml, the API key and browser profiles.
# Workflow files the user edited are backed up to .local/workflow-backups/<time>/ before being
# replaced; files removed upstream are moved there too, never deleted. On the very first update
# (no .workflow-manifest yet) every changed file is backed up, since edits can't be told apart.
#
# Usage: sh scripts/update_workflow.sh [--check] [--force] [target_folder]
#   --check  only report whether a newer version exists
#   --force  reinstall even if the version is unchanged
# Old folders without this script:
#   curl -fsSL https://raw.githubusercontent.com/Tinasoft-Viet-Nam/TinaCRM-Agent/main/scripts/update_workflow.sh | sh -s -- "$PWD"
#
# Output: one "changed: <path>" line per added/updated/removed file (also saved to
# .local/workflow-last-update.txt), then a last line
# status=<up_to_date|update_available|updated|busy|error> ...
# busy: another update is running in this folder right now.
# Exit codes: 0 ok, 1 error.

REPO="${WORKFLOW_REPO:-Tinasoft-Viet-Nam/TinaCRM-Agent}"
BRANCH="${WORKFLOW_BRANCH:-main}"
ZIP_URL="${WORKFLOW_ZIP_URL:-https://codeload.github.com/$REPO/zip/refs/heads/$BRANCH}"

check_only=0
force=0
target=""
for arg in "$@"; do
  case "$arg" in
    --check) check_only=1 ;;
    --force) force=1 ;;
    *) target="$arg" ;;
  esac
done

die() { echo "status=error message=\"$1\""; exit 1; }

if [ -z "$target" ]; then
  script_dir=$(cd "$(dirname "$0")" 2>/dev/null && pwd)
  { [ -f "$script_dir/../AGENTS.md" ] || [ -f "$script_dir/../CLAUDE.md" ]; } && [ -n "$script_dir" ] && target="$script_dir/.." || target="$PWD"
fi
target=$(cd "$target" 2>/dev/null && pwd) || die "Không tìm thấy thư mục $target"
# AGENTS.md since the Codex release; older folders only have CLAUDE.md.
{ [ -f "$target/AGENTS.md" ] || [ -f "$target/CLAUDE.md" ]; } && [ -d "$target/workflows" ] || die "Thư mục $target không phải thư mục workflow"
if [ -d "$target/.git" ] && [ -z "$WORKFLOW_ALLOW_GIT" ]; then
  die "Thư mục này là bản git; dùng git pull thay cho script cập nhật"
fi

version_file="$target/.workflow-version"
manifest_file="$target/.workflow-manifest"
current=$(cat "$version_file" 2>/dev/null)

latest="${WORKFLOW_SHA:-}"
if [ -z "$latest" ]; then
  latest=$(curl -fsSL -m 30 -H "Accept: application/vnd.github.sha" \
    "https://api.github.com/repos/$REPO/commits/$BRANCH" 2>/dev/null)
fi
case "$latest" in
  *[!0-9a-f]*|"") latest="" ;;
esac

if [ -n "$latest" ] && [ "$latest" = "$current" ] && [ "$force" = 0 ]; then
  echo "status=up_to_date version=$(echo "$current" | cut -c1-7)"
  exit 0
fi
if [ "$check_only" = 1 ]; then
  if [ -z "$latest" ]; then
    echo "status=update_available current=${current:-unknown} latest=unknown"
  else
    echo "status=update_available current=$(echo "${current:-unknown}" | cut -c1-7) latest=$(echo "$latest" | cut -c1-7)"
  fi
  exit 0
fi

# One update at a time per folder: scheduled runs of several campaigns may start close together.
# A lock older than 15 minutes is left over from a crashed run and is taken over.
mkdir -p "$target/.local" || die "Không tạo được thư mục .local"
lock="$target/.local/workflow-update.lock"
if ! mkdir "$lock" 2>/dev/null; then
  if [ -n "$(find "$lock" -maxdepth 0 -mmin +15 2>/dev/null)" ]; then
    rm -rf "$lock" && mkdir "$lock" 2>/dev/null || { echo "status=busy"; exit 0; }
  else
    echo "status=busy"
    exit 0
  fi
fi

tmp=$(mktemp -d 2>/dev/null) || { rmdir "$lock"; die "Không tạo được thư mục tạm"; }
trap 'rm -rf "$tmp" "$lock"' EXIT
curl -fsSL -m 300 -o "$tmp/workflow.zip" "$ZIP_URL" || die "Không tải được bản mới từ GitHub"
unzip -q "$tmp/workflow.zip" -d "$tmp/x" || die "Tệp tải về bị lỗi"
src=$(find "$tmp/x" -mindepth 1 -maxdepth 1 -type d | head -1)
{ [ -f "$src/AGENTS.md" ] || [ -f "$src/CLAUDE.md" ]; } && [ -f "$src/scripts/update_workflow.sh" ] || die "Bản tải về không đúng cấu trúc workflow"

# Paths owned by the business: only created when missing, never overwritten or moved.
is_protected() {
  case "$1" in
    inputs/*|outputs/*|campaigns/*|.local/*|.venv/*|.venv-browser/*|config/.browser_profile/*) return 0 ;;
    config/business.json|config/workflow_progress.md|config/tinacrm_api_key.txt) return 0 ;;
    product-marketing.md|.mcp.json|.codex/config.toml|CLAUDE.local.md|.claude/settings.local.json) return 0 ;;
    .env|.env.*|config/.env|config/.env.*) return 0 ;;
    .workflow-version|.workflow-manifest) return 0 ;;
  esac
  return 1
}

# Copy to a temp name then rename, so a running script (including this one) is never
# rewritten in place.
install_file() {
  mkdir -p "$(dirname "$target/$1")" && cp "$src/$1" "$target/$1.update-tmp" && mv -f "$target/$1.update-tmp" "$target/$1"
}

stamp=$(date +%Y%m%d-%H%M%S)
backup="$target/.local/workflow-backups/$stamp"
new_manifest="$tmp/manifest"
added=0; updated=0; removed=0; backed=0

# web-docs/ (guide website, shipped by older releases; now repo TinaCRM-Agent-Docs) is never installed.
(cd "$src" && find . -type f | sed 's#^\./##' | grep -v '^web-docs/' | LC_ALL=C sort) > "$tmp/files"

# Manifest line: "<sha256>  <path>" of the version installed by the last update.
hash_of() { shasum -a 256 "$1" 2>/dev/null | cut -d' ' -f1 || sha256sum "$1" | cut -d' ' -f1; }
old_hash() { [ -f "$manifest_file" ] && grep -F "  $1" "$manifest_file" | awk -v p="$1" 'substr($0, 67) == p { print $1; exit }'; }
# A local file counts as user-edited unless it matches what the last update installed.
backup_if_edited() {
  [ "$(hash_of "$target/$1")" = "$(old_hash "$1")" ] && return 0
  mkdir -p "$(dirname "$backup/$1")" && cp -p "$target/$1" "$backup/$1" && backed=$((backed + 1))
}

: > "$new_manifest"
while IFS= read -r rel; do
  dest="$target/$rel"
  printf '%s  %s\n' "$(hash_of "$src/$rel")" "$rel" >> "$new_manifest"
  if [ -e "$dest" ]; then
    is_protected "$rel" && continue
    cmp -s "$src/$rel" "$dest" && continue
    backup_if_edited "$rel" || die "Không sao lưu được $rel"
    install_file "$rel" || die "Không ghi được $rel"
    updated=$((updated + 1))
  else
    install_file "$rel" || die "Không ghi được $rel"
    added=$((added + 1))
  fi
  echo "$rel" >> "$tmp/changed"
  case "$rel" in *.sh|*.py) chmod +x "$dest" 2>/dev/null ;; esac
done < "$tmp/files"

# Files that the previous update installed but the new version no longer has:
# moved into the backup folder, never deleted.
if [ -f "$manifest_file" ]; then
  cut -c67- "$manifest_file" | LC_ALL=C sort | LC_ALL=C comm -23 - "$tmp/files" > "$tmp/gone"
  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    is_protected "$rel" && continue
    [ -f "$target/$rel" ] || continue
    mkdir -p "$(dirname "$backup/$rel")" && mv "$target/$rel" "$backup/$rel" && removed=$((removed + 1)) \
      && echo "$rel (removed)" >> "$tmp/changed"
  done < "$tmp/gone"
fi

cp "$new_manifest" "$manifest_file"
[ -n "$latest" ] && printf '%s\n' "$latest" > "$version_file"

# The assistant re-reads these files after an update instead of relying on the old session context.
touch "$tmp/changed"
cp "$tmp/changed" "$target/.local/workflow-last-update.txt"
sed 's/^/changed: /' "$tmp/changed"

[ -d "$backup" ] || backup=""
echo "status=updated version=$(echo "${latest:-unknown}" | cut -c1-7) added=$added updated=$updated removed=$removed backup=${backup#"$target/"}"
