# Frontend Workflow Validation & Testing Prompt Template

## **Objective Statement**
Review and validate the Resume Achievement Logger frontend workflow components, ensuring complete adherence to design system standards, eliminating bugs and conflicts, implementing code quality standards, and establishing comprehensive automated unit tests with terminal execution capabilities.

## **Validation Scope**

### **Primary Files to Review & Update**
- `/agent/ResumeLogger.jsx` - Main component implementation
- `/src/index.css` - Design system styles and utilities
- `/tailwind.config.js` - Theme configuration and custom components
- `/src/App.js` - Application entry point and routing
- `/package.json` - Dependencies and scripts configuration
- `/public/index.html` - HTML structure and font loading

### **Standards Compliance Checklist**

#### **Design System Implementation**
- [ ] **Color Palette**: All colors from defined palette (`#f1f5f9`, `#e2e8f0`, `#6366f1`, etc.)
- [ ] **Typography**: Aptos font family implementation with proper weights (400-800)
- [ ] **Spacing Scale**: Consistent use of design system spacing (`4px`, `8px`, `16px`, `24px`, etc.)
- [ ] **Border Radius**: Standardized radius values (`8px`, `12px`, `16px`, `20px`)
- [ ] **Component Structure**: Card-based layouts with proper hierarchy
- [ ] **Responsive Design**: Mobile-first breakpoints (320px, 768px, 1024px, 1400px+)

#### **Frontend Workflow Stages**
- [ ] **Reflection Stage**: Large textarea, placeholder text, primary action button
- [ ] **Processing Stage**: Loading animation with brain icon, minimal UI, progress indicators
- [ ] **Review Stage**: Grid layout, field cards, edit functionality, color-coded badges
- [ ] **Success Stage**: Confirmation message, API response display, "Log Another" action

#### **Interaction Patterns**
- [ ] **Inline Editing**: Click-to-edit functionality with proper focus management
- [ ] **State Management**: Proper React hooks usage with useCallback optimization
- [ ] **Error Handling**: Graceful API failure handling with user feedback
- [ ] **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## **Code Quality Requirements**

### **React Component Standards**
```javascript
// Expected patterns:
const Component = () => {
  const [state, setState] = useState(initial);
  const handleAction = useCallback((param) => {
    // Logic here
  }, [deps]);
  return <div className="design-system-classes">Content</div>;
};
```

### **Performance Optimizations**
- [ ] **useCallback** for all event handlers
- [ ] **Efficient re-rendering** with proper dependency arrays
- [ ] **Tailwind utilities** over custom CSS
- [ ] **Font loading optimization** with preconnect and display=swap

### **Error Prevention**
- [ ] **Input validation** with clear error messaging
- [ ] **Network failure handling** with retry options
- [ ] **API timeout management** with user feedback
- [ ] **Type safety** with proper prop validation

## **Automated Testing Implementation**

### **Required Test Suite**
Create comprehensive unit tests covering:

#### **Component Testing**
- [ ] **Stage transitions** (reflection → processing → review → success)
- [ ] **User input handling** (text validation, character limits)
- [ ] **API integration** (success/failure scenarios)
- [ ] **Edit functionality** (inline editing, save/cancel)
- [ ] **Responsive behavior** (mobile, tablet, desktop layouts)

#### **Integration Testing**
- [ ] **End-to-end workflow** (complete user journey)
- [ ] **API error scenarios** (network failures, timeouts)
- [ ] **Data persistence** (form state management)
- [ ] **Browser compatibility** (Chrome, Firefox, Safari, Edge)

#### **Accessibility Testing**
- [ ] **Keyboard navigation** (tab order, escape key handling)
- [ ] **Screen reader compatibility** (ARIA labels, status announcements)
- [ ] **Color contrast ratios** (WCAG 2.1 AA compliance)
- [ ] **Focus management** (proper focus states and indicators)

### **Testing Framework Setup**
```json
// package.json testing dependencies
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest-environment-jsdom": "^29.7.0"
  },
  "scripts": {
    "test": "jest --watchAll=false",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --watchAll=false"
  }
}
```

## **Terminal Testing Instructions**

### **Setup Commands**
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Run full test suite
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for development
npm run test:watch
```

### **Test Execution Guide**
```bash
# 1. Run all tests
npm test

# 2. Run specific test file
npm test -- ResumeLogger.test.jsx

# 3. Run tests matching pattern
npm test -- --testNamePattern="stage transition"

# 4. Generate coverage report
npm run test:coverage
# Coverage report will be in ./coverage/lcov-report/index.html
```

### **Expected Test Output**
```
PASS  src/components/ResumeLogger.test.jsx
  ✓ renders reflection stage initially (25ms)
  ✓ handles user input correctly (18ms)
  ✓ transitions to processing stage on submit (32ms)
  ✓ displays structured data in review stage (41ms)
  ✓ enables inline editing functionality (28ms)
  ✓ handles API errors gracefully (35ms)
  ✓ completes full workflow successfully (67ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Coverage:    95.2% lines, 92.8% functions, 94.1% branches
```

## **Linting & Code Quality**

### **ESLint Configuration**
```bash
# Install and configure ESLint
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks

# Run linting
npx eslint src/ agent/ --ext .js,.jsx

# Fix auto-fixable issues
npx eslint src/ agent/ --ext .js,.jsx --fix
```

### **Prettier Configuration**
```bash
# Install Prettier
npm install --save-dev prettier

# Format code
npx prettier --write "src/**/*.{js,jsx}" "agent/**/*.{js,jsx}"
```

## **Validation Deliverables**

### **Code Review Report**
- [ ] **Bug identification** and resolution status
- [ ] **Design system compliance** checklist completion
- [ ] **Performance optimization** implementations
- [ ] **Accessibility audit** results and fixes

### **Test Implementation**
- [ ] **Complete test suite** with 90%+ coverage
- [ ] **Terminal execution instructions** for user testing
- [ ] **CI/CD integration** readiness
- [ ] **Cross-browser compatibility** validation

### **Documentation Updates**
- [ ] **Component API documentation** updates
- [ ] **Testing guide** for future developers
- [ ] **Troubleshooting section** for common issues
- [ ] **Performance benchmarks** and optimization notes

## **Success Criteria**

### **Functional Requirements**
- [ ] All four workflow stages function correctly
- [ ] Responsive design works across all target devices
- [ ] API integration handles success and failure scenarios
- [ ] User can complete full achievement logging workflow

### **Quality Standards**
- [ ] Zero ESLint errors or warnings
- [ ] 90%+ test coverage on critical paths
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Design system consistency across all components

### **Performance Benchmarks**
- [ ] Initial page load < 2 seconds
- [ ] Stage transitions < 200ms
- [ ] API response handling < 100ms UI feedback
- [ ] Mobile performance score > 90 (Lighthouse)

---

**Execute this prompt to ensure the Resume Achievement Logger frontend meets production-ready standards with comprehensive testing capabilities and user validation instructions.**