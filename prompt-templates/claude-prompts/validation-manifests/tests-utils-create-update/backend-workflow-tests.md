# Backend Workflow Tests - Simple Prompt

## **Single Command Execution**

```bash
# Terminal command to run these tests
test-backend
```

## **Validation Prompt**

"Create simple, focused tests for the backend workflow functionality. Build test scripts that validate the main API endpoint (/log-entry), test Git operations, and verify error handling scenarios. Create practical tests that actually call the API, create test files, and verify Git commits work. Generate a zsh alias 'test-backend' that runs all backend tests with clear pass/fail output."

## **Expected Deliverables**

1. **Test Scripts**:
   - `test_api_endpoint.py` - Tests POST /log-entry with real data
   - `test_git_operations.py` - Tests file creation and Git commits
   - `test_error_scenarios.py` - Tests failure modes
   - Integration test that runs full workflow

2. **Terminal Setup**:
   - zsh alias for 'test-backend' command
   - Runs all backend tests in sequence
   - Uses test data that doesn't pollute main repo
   - Clean setup/teardown for each test

3. **Terminal Output**:
   ```
   Running backend workflow tests...
   ✅ API endpoint: Responds correctly to valid data
   ✅ Git operations: Creates files and commits
   ✅ Error handling: Fails gracefully on bad input
   ✅ Full workflow: End-to-end success
   ✅ All backend tests passed
   ```

## **Success Criteria**

- [ ] Tests actual API functionality
- [ ] Verifies Git operations work
- [ ] Tests error scenarios
- [ ] Single command runs all tests
- [ ] Clean test environment (no pollution)
- [ ] Clear pass/fail for each test component