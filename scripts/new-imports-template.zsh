# zsh /Users/rinikrishnan/resume-knowledge-base/scripts/new-imports-template.zsh

# Creates files from ~/Downloads/Imports at their designated project paths. Creates all necessary parent directories first.

set -uo pipefail

# ---- Config ----
IMPORT_DIR="${HOME}/Downloads/Imports"

# ---- File Path Mapping ----
# Define the mapping between import file names and their target paths
typeset -A FILE_MAPPING

# Handle the actual filenames in your Downloads/Imports directory
FILE_MAPPING[flake8_config.txt]=".flake8"
FILE_MAPPING[pyproject_toml.txt]="pyproject.toml"
FILE_MAPPING[lint_frontend.sh]="tools/linting/lint-frontend"
FILE_MAPPING[lint_backend.sh]="tools/linting/lint-backend"
FILE_MAPPING[test_error_handling_sh.sh]="tests/scripts/test_error_handling.sh"
FILE_MAPPING[eslintignore.txt]=".eslintignore"
FILE_MAPPING[mypy_ini.txt]=".mypy.ini"
FILE_MAPPING[lint_design.sh]="tools/linting/lint-design"
FILE_MAPPING[requirements_test.txt]="requirements-test.txt"
FILE_MAPPING[prettierrc.json]=".prettierrc"
FILE_MAPPING[eslintrc_js.js]=".eslintrc.js"
FILE_MAPPING[requirements_dev.txt]="requirements-dev.txt"

# Additional mappings for expected files (if they appear later)
FILE_MAPPING[test_api_endpoint.py]="tests/unit/test_api_endpoint.py"
FILE_MAPPING[test_git_operations.py]="tests/unit/test_git_operations.py"
FILE_MAPPING[test_error_scenarios.py]="tests/unit/test_error_scenarios.py"
FILE_MAPPING[test_data_processing.py]="tests/unit/test_data_processing.py"
FILE_MAPPING[test_stage_transitions.py]="tests/unit/test_stage_transitions.py"
FILE_MAPPING[test_user_interactions.py]="tests/unit/test_user_interactions.py"
FILE_MAPPING[test_responsive_design.py]="tests/unit/test_responsive_design.py"
FILE_MAPPING[validate_backend.py]="tests/integration/validate_backend.py"
FILE_MAPPING[check_design_compliance.js]="tools/validation/check_design_compliance.js"
FILE_MAPPING[test_error_handling.sh]="tests/scripts/test_error_handling.sh"
FILE_MAPPING[validate_frontend.js]="tools/validation/validate_frontend.js"
FILE_MAPPING[test-backend]="tests/scripts/test-backend"
FILE_MAPPING[test-frontend]="tests/scripts/test-frontend"

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
  echo "Error: ${IMPORT_DIR} does not exist."
  exit 1
fi

# Collect import files
typeset -a import_files
while IFS= read -r -d '' f; do
  import_files+=("$f")
done < <(find "${IMPORT_DIR}" -type f -print0)

if (( ${#import_files[@]} == 0 )); then
  echo "No files found in ${IMPORT_DIR}. Nothing to do."
  exit 0
fi

echo "Repository: ${REPO_ROOT}"
echo "Imports dir: ${IMPORT_DIR}"
echo "Found ${#import_files[@]} files to process"
echo ""

# Skip .DS_Store files automatically
for imp in "${import_files[@]}"; do
  base="${imp:t}"  # basename
  
  # Skip macOS system files
  if [[ "${base}" == ".DS_Store" ]]; then
    echo "Skipping system file: ${base}"
    continue
  fi
  
  # Check if we have a mapping for this file
  if [[ -n "${FILE_MAPPING[$base]:-}" ]]; then
    target_path="${REPO_ROOT}/${FILE_MAPPING[$base]}"
    target_dir="${target_path:h}"  # directory part
    
    echo "Processing: ${base}"
    echo "  → Target: ${FILE_MAPPING[$base]}"
    
    # Create parent directories if they don't exist
    if [[ ! -d "${target_dir}" ]]; then
      if mkdir -p "${target_dir}"; then
        echo "  ✓ Created directory: ${target_dir}"
      else
        echo "  ✗ Failed to create directory: ${target_dir}" >&2
        (( count_errors++ ))
        continue
      fi
    fi
    
    # Check if target file already exists
    if [[ -f "${target_path}" ]]; then
      echo "  ⚠ File already exists: ${target_path}"
      (( count_skipped++ ))
      continue
    fi
    
    # Copy the file to target location
    if cp "${imp}" "${target_path}"; then
      echo "  ✓ Created: ${target_path}"
      (( count_created++ ))
      
      # Make executable if it's a script file
      if [[ "${FILE_MAPPING[$base]}" == tools/linting/* || "${FILE_MAPPING[$base]}" == tests/scripts/* ]]; then
        if chmod +x "${target_path}"; then
          echo "  ✓ Made executable: ${target_path}"
        else
          echo "  ⚠ Warning: Failed to make executable: ${target_path}" >&2
        fi
      fi
      
      # CRITICAL: Delete the source file after successful copy
      if rm "${imp}"; then
        echo "  ✓ Deleted source: ${imp}"
      else
        echo "  ✗ ERROR: Failed to delete source file: ${imp}" >&2
        echo "  ⚠ Manual cleanup required for: ${imp}" >&2
        (( count_errors++ ))
      fi
    else
      echo "  ✗ Failed to copy: ${imp} → ${target_path}" >&2
      echo "  → Source file retained: ${imp}"
      (( count_errors++ ))
    fi
    
    echo ""
  else
    echo "No mapping found for: ${base} (skipping)"
    (( count_skipped++ ))
  fi
done

echo "Summary:"
echo "  Files created: ${count_created}"
echo "  Files skipped (already exist): ${count_skipped}"
echo "  Source files deleted: ${count_created}"
echo "  Errors: ${count_errors}"

if (( count_errors > 0 )); then
  echo ""
  echo "⚠ WARNING: ${count_errors} errors occurred during processing."
  echo "Some source files may require manual cleanup."
fi

# Show remaining files in import directory
remaining_files=()
while IFS= read -r -d '' f; do
  remaining_files+=("$f")
done < <(find "${IMPORT_DIR}" -type f -print0)

if (( ${#remaining_files[@]} > 0 )); then
  echo ""
  echo "Remaining files in ${IMPORT_DIR}:"
  for f in "${remaining_files[@]}"; do
    echo "  ${f:t}"
  done
else
  echo ""
  echo "✅ All mapped files processed and deleted from ${IMPORT_DIR}."
  echo "Only unmapped files remain (if any)."
fi

# Create any missing directories that should exist even without files
echo ""
echo "Ensuring all required directories exist..."

required_dirs=(
  "tests"
  "tests/unit"
  "tests/integration"
  "tests/scripts"
  "tools"
  "tools/linting"
  "tools/validation"
)

for dir in "${required_dirs[@]}"; do
  full_path="${REPO_ROOT}/${dir}"
  if [[ ! -d "${full_path}" ]]; then
    if mkdir -p "${full_path}"; then
      echo "  ✓ Created directory: ${dir}"
    else
      echo "  ✗ Failed to create directory: ${dir}" >&2
    fi
  fi
done

echo ""
echo "File structure creation complete!"
echo ""
echo "New directory structure:"
echo "tests/"
echo "├── unit/"
echo "├── integration/"
echo "└── scripts/"
echo "tools/"
echo "├── linting/"
echo "└── validation/"