# Design Lint Suite - Simple Prompt

## **Single Command Execution**

```bash
# Terminal command to run this linting
lint-design
```

## **Validation Prompt**

"Create a simple design linting system that checks for unauthorized colors, fonts, and spacing in the frontend files. Build a lightweight Node.js script that scans agent/ResumeLogger.jsx and src/index.css for design system violations (colors not in approved palette, fonts other than Aptos/Aptos Mono, spacing not on the scale). Create a zsh alias 'lint-design' that runs this check with clear output about any violations found."

## **Expected Deliverables**

1. **Design Linting Script**:
   - Simple Node.js script that scans files
   - Checks colors against approved palette
   - Validates font usage (Aptos only)
   - Confirms spacing scale adherence
   - Reports violations with file/line numbers

2. **Terminal Setup**:
   - zsh alias for 'lint-design' command
   - Single command scans all frontend files
   - Clear reporting of any design violations

3. **Terminal Output**:
   ```
   Scanning design system compliance...
   ✅ Colors: All from approved palette
   ✅ Fonts: Aptos family only
   ✅ Spacing: Design scale followed
   ✅ Design linting passed
   
   OR if violations found:
   ❌ src/index.css:42 - Unauthorized color #123456
   ❌ ResumeLogger.jsx:15 - Non-design-system spacing
   ```

## **Success Criteria**

- [ ] Single 'lint-design' command works
- [ ] Scans files for design violations
- [ ] Reports specific file/line violations
- [ ] Validates colors, fonts, spacing
- [ ] Clear pass/fail feedback
- [ ] Lightweight and fast execution