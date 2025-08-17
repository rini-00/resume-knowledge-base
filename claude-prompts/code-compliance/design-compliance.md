# Design Compliance

## **Single Command Execution**

```bash
# Terminal command to run this validation
npm run check:design
```

## **Validation Prompt**

"Audit all frontend files for design system compliance and fix any violations. Check that all colors match the approved palette (#f1f5f9, #e2e8f0, #6366f1, etc.), fonts use only Aptos/Aptos Mono, spacing follows the scale (4px, 8px, 16px, 24px, 32px, 48px, 64px), and components match the design specifications. Update src/index.css, tailwind.config.js, and agent/ResumeLogger.jsx to fix any issues. Generate a simple npm script that validates design compliance from terminal."

## **Expected Deliverables**

1. **Updated Files**:
   - `src/index.css` - Design system compliance
   - `tailwind.config.js` - Proper theme configuration
   - `agent/ResumeLogger.jsx` - Compliant component styling
   - `package.json` - Added check:design script

2. **Design Validation Script**:
   - npm script that checks color usage
   - Validates font family implementation
   - Confirms spacing scale adherence
   - Reports any violations

3. **Terminal Output**:
   ```
   ✅ Color palette: All colors approved
   ✅ Typography: Aptos fonts implemented correctly
   ✅ Spacing: Design scale followed
   ✅ Components: All styling compliant
   ✅ Design system validation passed
   ```

## **Success Criteria**

- [ ] All colors from approved palette only
- [ ] Aptos/Aptos Mono fonts exclusively
- [ ] Spacing scale consistently applied
- [ ] Components match design specs
- [ ] Single npm command validates everything
- [ ] Clear violation reporting if any issues
