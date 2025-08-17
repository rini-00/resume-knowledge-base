# zsh -x /Users/rinikrishnan/resume-knowledge-base/scripts/sync-imports.zsh

# ------Overwrite matching Markdown files in the current Git repo with contents from ~/Downloads/Imports. 
# Matches are case-insensitive and treat underscores = dashes.
# Deletes import files after successful replacement.-------

set -uo pipefail

# ---- Config ----
IMPORT_DIR="${HOME}/Downloads/Imports"

# ---- Preconditions ----
if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed or not in PATH." >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "Error: Not inside a Git repository. cd to your repo root and re-run." >&2
  exit 1
fi

# Ensure Imports dir exists
if [[ ! -d "${IMPORT_DIR}" ]]; then
  mkdir -p "${IMPORT_DIR}"
  echo "Created ${IMPORT_DIR}. Add Markdown files there and re-run."
  exit 0
fi

# Collect import files
typeset -a import_files
while IFS= read -r -d '' f; do
  import_files+=("$f")
done < <(find "${IMPORT_DIR}" -type f \( -iname '*.md' -o -iname '*.markdown' -o -iname '*.mdx' \) -print0)

if (( ${#import_files[@]} == 0 )); then
  echo "No Markdown files found in ${IMPORT_DIR}. Nothing to do."
  exit 0
fi

echo "Repository: ${REPO_ROOT}"
echo "Imports dir: ${IMPORT_DIR}"
echo "This will OVERWRITE matching files in the repo and DELETE successfully imported files."
read -q "REPLY?Proceed? [y/N] "; echo
if [[ ! "${REPLY}" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

# ---- Replace matches ----
count_total=0
count_updated=0
count_skipped=0
count_deleted=0
count_no_matches=0

for imp in "${import_files[@]}"; do
  base="${imp:t}"                  # basename, e.g. backend_validation.md
  base_dash="${base//_/-}"         # convert underscores to dashes

  typeset -a matches
  # Case-insensitive search for either basename or underscore→dash variant
  while IFS= read -r -d '' m; do
    matches+=("$m")
  done < <(find "${REPO_ROOT}" -path "${REPO_ROOT}/.git" -prune -o -type f \
              \( -iname "${base}" -o -iname "${base_dash}" \) -print0)

  if (( ${#matches[@]} == 0 )); then
    echo "No matches found in repo for: ${base}"
    (( count_no_matches++ ))
    continue
  fi

  file_was_updated=false

  for m in "${matches[@]}"; do
    (( count_total++ ))

    # Skip self-overwrite if someone runs in ~/Downloads/Imports
    if [[ "${m}" == "${imp}" ]]; then
      echo "Skipping self: ${m}"
      (( count_skipped++ ))
      continue
    fi

    # If identical, skip but still mark as processed
    if cmp -s "${imp}" "${m}"; then
      echo "Unchanged (already identical): ${m}"
      (( count_skipped++ ))
      file_was_updated=true
      continue
    fi

    # Create backup with timestamp
    backup_suffix=".bak.$(date +%Y%m%d%H%M%S)"
    if cp "${m}" "${m}${backup_suffix}"; then
      echo "Backup created: ${m}${backup_suffix}"
    else
      echo "Warning: Failed to create backup for ${m}" >&2
    fi

    # Attempt to update the file
    if cat "${imp}" > "${m}"; then
      echo "Updated: ${m}  ←  ${imp}"
      (( count_updated++ ))
      file_was_updated=true
    else
      echo "Failed to write: ${m}" >&2
    fi
  done

  # Delete the import file if it was successfully processed (updated or already identical)
  if [[ "${file_was_updated}" == "true" ]]; then
    if rm "${imp}"; then
      echo "Deleted import file: ${imp}"
      (( count_deleted++ ))
    else
      echo "Warning: Failed to delete import file: ${imp}" >&2
    fi
  fi
done

echo "Done."
echo "Import files processed: ${#import_files[@]}"
echo "Repo matches considered: ${count_total}"
echo "Updated: ${count_updated}"
echo "Skipped (identical/self): ${count_skipped}"
echo "Import files deleted: ${count_deleted}"
echo "Import files with no matches (remaining): ${count_no_matches}"
echo "Backups placed next to files with suffix: .bak.YYYYMMDDHHMMSS"

# Show remaining files in import directory
remaining_files=()
while IFS= read -r -d '' f; do
  remaining_files+=("$f")
done < <(find "${IMPORT_DIR}" -type f \( -iname '*.md' -o -iname '*.markdown' -o -iname '*.mdx' \) -print0)

if (( ${#remaining_files[@]} > 0 )); then
  echo ""
  echo "Remaining files in ${IMPORT_DIR}:"
  for f in "${remaining_files[@]}"; do
    echo "  ${f:t}"
  done
else
  echo ""
  echo "All import files processed successfully. ${IMPORT_DIR} is now empty of Markdown files."
fi