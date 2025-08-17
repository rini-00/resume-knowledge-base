# Frontend Lint Suite

## **Single Command Execution**

```bash
# Terminal command to run this linting
lint-frontend
```

## **Validation Prompt**

"Set up or update (if existing and only if necessary) lightweight frontend linting for the React/JavaScript files. Install and configure essential tools like ESLint for code quality, Prettier for formatting, and basic accessibility checking. Create a zsh file 'lint-frontend' and instruct the user to place it in the same folder as this md file, **only if one does not already exist or the exiting one requires updates**, that runs all frontend linting with a single command. Keep it simple and fast - just the basics needed for clean React code on a personal project."

## **Expected Deliverables**

1. **Linting Configuration**:
   - Updated `package.json` with minimal dev dependencies (eslint, prettier)
   - `.eslintrc.js` - Basic React configuration
   - `.prettierrc` - Simple formatting rules
   - Auto-fix applied to frontend files

2. **Terminal Setup**:
   - zsh alias for 'lint-frontend' command
   - Single command runs ESLint + Prettier
   - Auto-fixes what it can, reports remaining issues

3. **Terminal Output**:
   ```
   Running frontend linting...
   ✅ Code formatting (prettier): Applied
   ✅ Code quality (eslint): Passed
   ✅ React patterns: Following best practices
   ✅ Frontend linting complete
   ```

## **Success Criteria**

- [ ] Single 'lint-frontend' command works
- [ ] Code automatically formatted
- [ ] React/JSX issues caught
- [ ] Basic accessibility rules applied
- [ ] Fast execution for personal use
- [ ] Clear feedback on fixes applied
