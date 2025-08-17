# zsh /Users/rinikrishnan/resume-knowledge-base/docs/run-profiles.zsh

# ----- Runs two profiles in order and summarizes errors: ----- 
#   1) zsh-script-gen
#   2) zsh-validation-run
# Logs go to docs/run-logs/*.log
# Success message (exact text) printed only when no errors are detected in logs and both profiles exit 0.

set -uo pipefail

# Load user shell so profiles are available if defined there
[[ -f "${HOME}/.zshrc" ]] && source "${HOME}/.zshrc"

# Locate repo root and move there
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "${REPO_ROOT}" || { echo "ERROR: cannot cd to repo root"; exit 2; }

# Verify profiles exist
if ! typeset -f zsh-script-gen >/dev/null; then
  echo "ERROR: zsh-script-gen profile not found in current shell."
  exit 127
fi
if ! typeset -f zsh-validation-run >/dev/null; then
  echo "ERROR: zsh-validation-run profile not found in current shell."
  exit 127
fi

# Prepare logs
LOG_DIR="${REPO_ROOT}/docs/run-logs"
mkdir -p "${LOG_DIR}"
SCRIPT_GEN_LOG="${LOG_DIR}/script-gen.log"
VALIDATION_LOG="${LOG_DIR}/validation-run.log"
: > "${SCRIPT_GEN_LOG}"
: > "${VALIDATION_LOG}"

# Run profiles in order, capturing exit codes
# 1) zsh-script-gen
{
  echo "=== zsh-script-gen START $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="
  zsh-script-gen
  echo "=== zsh-script-gen END $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="
} >> "${SCRIPT_GEN_LOG}" 2>&1
EXIT_SCRIPT_GEN=$?

# 2) zsh-validation-run
{
  echo "=== zsh-validation-run START $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="
  zsh-validation-run
  echo "=== zsh-validation-run END $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="
} >> "${VALIDATION_LOG}" 2>&1
EXIT_VALIDATION=$?

# Scan logs for error signals (keep this conservative)
pattern='(^|[^A-Za-z])(error|failed|fail|exception|traceback|npm ERR!|missing|not found|no such file)([^A-Za-z]|$)'

has_errors() {
  local file="$1"
  grep -E -i -n "${pattern}" "${file}" >/dev/null 2>&1
}

# Build cumulative table
typeset -a ROWS
ERR_COUNT=0

# Row builder: PROFILE | STATUS | EXIT | LOG
add_row() {
  local profile="$1" status="$2" code="$3" log="$4"
  ROWS+=("${profile}\t${status}\t${code}\t${log}")
  [[ "${status}" != "OK" ]] && (( ERR_COUNT+=1 ))
}

# Evaluate profile 1
if [[ "${EXIT_SCRIPT_GEN}" -ne 0 ]]; then
  add_row "zsh-script-gen" "FAIL" "${EXIT_SCRIPT_GEN}" "${SCRIPT_GEN_LOG}"
elif has_errors "${SCRIPT_GEN_LOG}"; then
  add_row "zsh-script-gen" "WARN" "0" "${SCRIPT_GEN_LOG}"
else
  add_row "zsh-script-gen" "OK" "0" "${SCRIPT_GEN_LOG}"
fi

# Evaluate profile 2
if [[ "${EXIT_VALIDATION}" -ne 0 ]]; then
  add_row "zsh-validation-run" "FAIL" "${EXIT_VALIDATION}" "${VALIDATION_LOG}"
elif has_errors "${VALIDATION_LOG}"; then
  add_row "zsh-validation-run" "WARN" "0" "${VALIDATION_LOG}"
else
  add_row "zsh-validation-run" "OK" "0" "${VALIDATION_LOG}"
fi

# Print summary
echo
echo "PROFILE             STATUS  EXIT  LOG"
for r in "${ROWS[@]}"; do
  # Expand tabs to fixed spacing for readability
  echo "${r}" | sed $'s/\t/    /g'
done

# Final outcome
if [[ "${ERR_COUNT}" -eq 0 ]]; then
  echo
  echo "All unit tests and validations have completed successfully. We are ready for UAT and/or deployment."
  exit 0
else
  echo
  echo "Detected ${ERR_COUNT} issue(s). Review logs above."
  exit 1
fi
