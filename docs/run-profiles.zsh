#!/bin/zsh
# Fixed run profiles script with repository-relative paths and error handling

set -uo pipefail

# ---- Configuration ----
SCRIPT_NAME="run-profiles"
PROFILE_NAME="${1:-validation-run}"

# ---- Repository Detection ----
if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed or not in PATH." >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "Error: Not inside a Git repository. cd to your repo root and re-run." >&2
  exit 1
fi

# ---- Logging Configuration ----
LOG_DIR="${REPO_ROOT}/docs/run-logs"
TIMESTAMP=$(date "+%Y%m%d-%H%M%S")
LOG_FILE="${LOG_DIR}/${SCRIPT_NAME}.${TIMESTAMP}.log"

# Ensure log directory exists
if ! mkdir -p "${LOG_DIR}" 2>/dev/null; then
  echo "Error: Cannot create log directory: ${LOG_DIR}" >&2
  exit 1
fi

# Clear previous logs (but keep recent ones)
find "${LOG_DIR}" -name "${SCRIPT_NAME}.*.log" -mtime +7 -delete 2>/dev/null || true

# ---- Logging Functions ----
log_message() {
  local level="$1"
  local message="$2"
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo "[$timestamp] [$level] $message" | tee -a "${LOG_FILE}"
}

log_info() {
  log_message "INFO" "$1"
}

log_error() {
  log_message "ERROR" "$1"
}

log_warn() {
  log_message "WARN" "$1"
}

# ---- Profile Definitions ----
typeset -A PROFILES

# Validation Run Profile
PROFILES[validation-run]="
tools/linting/lint-backend
tools/linting/lint-frontend  
tools/linting/lint-design
Tests/scripts/test-backend
Tests/scripts/test-frontend
Tests/scripts/test_error_handling.sh
Tests/integration/validate_backend.py
Tests/scripts/validate_frontend.js
Tools/validation/check_design_compliance.js
"

# Script Generation Profile
PROFILES[script-gen]="
Tests/unit/test_api_endpoint.py
Tests/unit/test_git_operations.py
Tests/unit/test_error_scenarios.py
Tests/unit/test_data_processing.py
Tests/unit/test_stage_transitions.py
Tests/unit/test_user_interactions.py
Tests/unit/test_responsive_design.py
Tests/integration/validate_backend.py
Tests/scripts/check_design_compliance.js
Tests/scripts/test_error_handling.sh
Tests/scripts/validate_frontend.js
"

# ---- Execution Functions ----
execute_script() {
  local script_path="$1"
  local absolute_path="${REPO_ROOT}/${script_path}"
  
  log_info "Executing: ${script_path}"
  
  # Check if file exists
  if [[ ! -f "${absolute_path}" ]]; then
    log_error "MISSING: ${script_path##*/}"
    return 1
  fi
  
  # Determine execution method based on file extension
  local exit_code=0
  case "${script_path}" in
    *.py)
      if command -v python3 >/dev/null 2>&1; then
        cd "${REPO_ROOT}" && python3 "${absolute_path}" >> "${LOG_FILE}" 2>&1
        exit_code=$?
      else
        log_error "Python3 not available for: ${script_path}"
        return 1
      fi
      ;;
    *.js)
      if command -v node >/dev/null 2>&1; then
        cd "${REPO_ROOT}" && node "${absolute_path}" >> "${LOG_FILE}" 2>&1
        exit_code=$?
      else
        log_error "Node.js not available for: ${script_path}"
        return 1
      fi
      ;;
    *.sh|lint-*|test-*|validate-*)
      # Make executable if not already
      if [[ ! -x "${absolute_path}" ]]; then
        chmod +x "${absolute_path}" 2>/dev/null || true
      fi
      
      if [[ -x "${absolute_path}" ]]; then
        cd "${REPO_ROOT}" && "${absolute_path}" >> "${LOG_FILE}" 2>&1
        exit_code=$?
      else
        # Try with bash
        cd "${REPO_ROOT}" && bash "${absolute_path}" >> "${LOG_FILE}" 2>&1
        exit_code=$?
      fi
      ;;
    *)
      log_error "Unknown file type: ${script_path}"
      return 1
      ;;
  esac
  
  # Log result
  if [[ $exit_code -eq 0 ]]; then
    log_info "SUCCESS: ${script_path##*/}"
  else
    log_error "FAILED: ${script_path##*/} (exit code: $exit_code)"
  fi
  
  return $exit_code
}

check_required_files() {
  local profile_name="$1"
  local scripts="${PROFILES[$profile_name]}"
  local missing_count=0
  
  log_info "Checking required files for profile: ${profile_name}"
  
  while IFS= read -r script_path; do
    # Skip empty lines
    [[ -z "${script_path// }" ]] && continue
    
    local absolute_path="${REPO_ROOT}/${script_path}"
    if [[ ! -f "${absolute_path}" ]]; then
      log_warn "Missing file: ${script_path}"
      ((missing_count++))
    else
      log_info "Found: ${script_path}"
    fi
  done <<< "${scripts}"
  
  if [[ $missing_count -gt 0 ]]; then
    log_warn "Found ${missing_count} missing files"
  else
    log_info "All required files present"
  fi
  
  return 0
}

# ---- Main Execution ----
main() {
  log_info "Starting ${SCRIPT_NAME} with profile: ${PROFILE_NAME}"
  log_info "Repository root: ${REPO_ROOT}"
  log_info "Log file: ${LOG_FILE}"
  
  # Validate profile
  if [[ -z "${PROFILES[$PROFILE_NAME]:-}" ]]; then
    log_error "Unknown profile: ${PROFILE_NAME}"
    log_info "Available profiles: ${(k)PROFILES}"
    exit 1
  fi
  
  # Check required files
  check_required_files "${PROFILE_NAME}"
  
  # Execute profile scripts
  local scripts="${PROFILES[$PROFILE_NAME]}"
  local total_scripts=0
  local successful_scripts=0
  local failed_scripts=0
  
  log_info "Executing profile: ${PROFILE_NAME}"
  
  while IFS= read -r script_path; do
    # Skip empty lines
    [[ -z "${script_path// }" ]] && continue
    
    ((total_scripts++))
    
    if execute_script "${script_path}"; then
      ((successful_scripts++))
    else
      ((failed_scripts++))
    fi
    
    echo "" >> "${LOG_FILE}"  # Add spacing between scripts
  done <<< "${scripts}"
  
  # Final summary
  log_info "Profile execution completed"
  log_info "Total scripts: ${total_scripts}"
  log_info "Successful: ${successful_scripts}"
  log_info "Failed: ${failed_scripts}"
  
  if [[ $failed_scripts -eq 0 ]]; then
    log_info "All scripts executed successfully"
    echo "✅ Profile '${PROFILE_NAME}' completed successfully"
    echo "📋 Log file: ${LOG_FILE}"
    exit 0
  else
    log_error "Some scripts failed"
    echo "❌ Profile '${PROFILE_NAME}' completed with errors"
    echo "📋 Log file: ${LOG_FILE}"
    echo "🔍 Check the log file for details"
    exit 1
  fi
}

# ---- Usage Information ----
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $0 [profile-name]"
  echo ""
  echo "Available profiles:"
  for profile in "${(k)PROFILES[@]}"; do
    echo "  - ${profile}"
  done
  echo ""
  echo "Default profile: validation-run"
  echo "Log directory: docs/run-logs/"
  exit 0
fi

# Execute main function
main "$@"