# zsh -x /Users/rinikrishnan/resume-knowledge-base/docs/run-profiles.zsh
# zsh /Users/rinikrishnan/resume-knowledge-base/docs/run-profiles.zsh


# Get the repo root directory
REPO_ROOT=$(git rev-parse --show-toplevel)

# ----- Clears old files in the run-logs folder to start fresh -----
echo "Clearing old files in the run-logs directory..."
rm -f "$REPO_ROOT/docs/run-logs/"*

# ----- Continue with the rest of the script -----
set -euo pipefail

cd $REPO_ROOT

# Define profiles and logs
PROFILES_MD="$REPO_ROOT/docs/zsh-profiles.md"
[[ ! -f $PROFILES_MD ]] && { echo "ERROR: $PROFILES_MD not found. Create it and paste the two profiles."; exit 127; }

# Create temporary profile file
TMP_PROFILES=$(mktemp /tmp/zsh-profiles.XXXXXX)

# Extract profiles from the markdown
awk $'\n  BEGIN{cap=0}\n  /^```[[:space:]]*(zsh|bash)[[:space:]]*$/ {cap=1; next}\n  /^```[[:space:]]*$/ {cap=0; next}\n  cap==1 {print}\n' $PROFILES_MD > $TMP_PROFILES

# Check if profile file is empty
if [[ ! -s $TMP_PROFILES ]]; then
  echo "ERROR: Profile extraction failed. Exiting."
  exit 127
fi

# Load the extracted profiles
source $TMP_PROFILES

# Clean up the temporary profiles file
rm -f $TMP_PROFILES

# Logging directories
LOG_DIR="$REPO_ROOT/docs/run-logs"
mkdir -p $LOG_DIR
TS=$(date +%Y%m%d-%H%M%S)
GEN_LOG="$LOG_DIR/script-gen.$TS.log"
VAL_LOG="$LOG_DIR/validation-run.$TS.log"
SUMMARY_FILE="$LOG_DIR/failed-tests-summary.$TS.txt"

# Confirm that the summary file variable is set correctly
echo "SUMMARY_FILE is set to: $SUMMARY_FILE"

# Run the profile script generation...
echo 'Running profile script generation...'
zsh-script-gen > $GEN_LOG 2>&1 || true

# Extract errors from the script generation log
extract_errs() {
  local f=$1
  LC_ALL=C grep -Ein '(^|[^A-Za-z])(error|failed|failure|traceback|exception|missing|not found|no such file|command not found)([^A-Za-z]|$)' $f || true
}

GEN_ERRS=$(extract_errs $GEN_LOG)

# Run the validation script
echo 'Running validation...'
zsh-validation-run > $VAL_LOG 2>&1 || true

# Extract errors from the validation log
VAL_ERRS=$(extract_errs $VAL_LOG)

# Output errors, if any
echo "Errors found:"
echo "PROFILE      | DETAIL"
echo "------------+------------------------------------------------------------"
for err in $GEN_ERRS; do
  printf '%-12s | %s\n' script-gen "$err"
done

for err in $VAL_ERRS; do
  printf '%-12s | %s\n' validation "$err"
done

# Create and write errors to the summary file
echo "Writing to the summary file..."
echo "Failed Tests Summary - Generated on $(date)" > $SUMMARY_FILE
echo "---------------------------------------------------" >> $SUMMARY_FILE
echo "" >> $SUMMARY_FILE

# Check for script generation errors
if [[ -n "$GEN_ERRS" ]]; then
  echo "#### Script Generation Errors:" >> $SUMMARY_FILE
  echo "" >> $SUMMARY_FILE
  for err in $GEN_ERRS; do
    echo "- $err" >> $SUMMARY_FILE
  done
else
  echo "#### No Script Generation Errors" >> $SUMMARY_FILE
  echo "  - No errors detected during script generation." >> $SUMMARY_FILE
fi

echo "" >> $SUMMARY_FILE

# Check for validation errors
if [[ -n "$VAL_ERRS" ]]; then
  echo "#### Validation Errors:" >> $SUMMARY_FILE
  echo "" >> $SUMMARY_FILE
  for err in $VAL_ERRS; do
    echo "- $err" >> $SUMMARY_FILE
  done
else
  echo "#### No Validation Errors" >> $SUMMARY_FILE
  echo "  - No errors detected during validation." >> $SUMMARY_FILE
fi

# Debug: Check if the summary file was created
echo "Summary file written to: $SUMMARY_FILE"
ls -l $SUMMARY_FILE

# Final cleanup
echo "Logs:"
echo "  $GEN_LOG"
echo "  $VAL_LOG"

exit 1
