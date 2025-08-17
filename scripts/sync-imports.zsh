# zsh -x /Users/rinikrishnan/resume-knowledge-base/scripts/sync-imports.zsh

# ------Overwrite matching Markdown files in the current Git repo with contents from ~/Downloads/Imports. 
# Matches are case-insensitive and treat underscores = dashes.-------

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
echo "This will OVERWRITE matching files in the repo (backups will be created)."
read -q "REPLY?Proceed? [y/N] "; echo
if [[ ! "${REPLY}" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

# ---- Replace matches ----
count_total=0
count_updated=0
count_skipped=0

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
    continue
  fi

  for m in "${matches[@]}"; do
    (( count_total++ ))

    # Skip self-overwrite if someone runs in ~/Downloads/Imports
    if [[ "${m}" == "${imp}" ]]; then
      echo "Skipping self: ${m}"
      (( count_skipped++ ))
      continue
    fi

    # If identical, skip
    if cmp -s "${imp}" "${m}"; then
      echo "Unchanged (already identical): ${m}"
      (( count_skipped++ ))
      continue
    fi

    cat "${imp}" > "${m}"
    echo "Updated: ${m}  ←  ${imp}"
    (( count_updated++ ))


    if cat "${imp}" > "${m}"; then
      echo "Updated: ${m}  ←  ${imp}"
      (( count_updated++ ))
    else
      echo "Failed to write: ${m}" >&2
    fi
  done
done

echo "Done."
echo "Matches considered: ${count_total}"
echo "Updated: ${count_updated}"
echo "Skipped (identical/self): ${count_skipped}"
echo "Backups placed next to files with suffix: .bak.YYYYMMDDHHMMSS"
