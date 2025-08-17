# Backend Lint Suite

## **Single Command Execution**

```bash
# Terminal command to run this linting
lint-backend
```

## **Validation Prompt**

"Set up (if not existing) or update (if existing and only if necessary) lightweight Python linting for the backend files (ie. api/main.py, api/add_log_entry.py). Install and configure basic tools like black for formatting, flake8 for style checking, and a simple security check. Create a zsh file 'lint-backend' that runs all linting with a single command and instruct the user to place it in the same folder as this md file, **only if one does not already exist or the exiting one requires updates**. Keep it minimal - just the essentials for code quality on a personal project."

## **Expected Deliverables**

1. **Linting Configuration**:
   - `requirements-dev.txt` - Minimal linting dependencies (black, flake8)
   - `.flake8` - Basic configuration file
   - Updated backend files if formatting issues found

2. **Terminal Setup**:
   - zsh alias or script for 'lint-backend' command
   - Single command runs all Python linting
   - Auto-fixes what it can, reports what needs manual attention

3. **Terminal Output**:
   ```
   Running backend linting...
   ✅ Code formatting (black): Applied
   ✅ Style checking (flake8): Passed
   ✅ Basic security (bandit): No issues
   ✅ Backend linting complete
   ```

## **Success Criteria**

- [ ] Single 'lint-backend' command works
- [ ] Code automatically formatted
- [ ] Style violations reported
- [ ] Basic security issues caught
- [ ] Minimal setup, maximum benefit
- [ ] Clear output showing what was done
