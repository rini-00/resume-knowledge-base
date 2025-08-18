# Design System Compliance Validation & Audit Prompt Template

## **Objective Statement**
Conduct a comprehensive design system compliance audit for the Resume Achievement Logger, ensuring strict adherence to design principles, color palette, typography hierarchy, spacing standards, component guidelines, and accessibility requirements across all interface elements and user journey stages.

## **Design System Foundation Audit**

### **Primary Files for Design Compliance**
- `/src/index.css` - Core design system implementation and CSS variables
- `/tailwind.config.js` - Theme configuration and custom components
- `/agent/ResumeLogger.jsx` - Component implementation and styling
- `/public/index.html` - Font loading and meta configuration
- `/ui_design_principles.md` - Design system specification reference

## **Critical Design Standards Checklist**

### **🌈 Color Palette Compliance**

#### **Background Color Validation**
- [ ] **Primary Background**: `#f1f5f9` (slate-75) used consistently
- [ ] **Secondary Background**: `#e2e8f0` (slate-100) for contrast areas
- [ ] **Surface Color**: `#ffffff` (pure white) for cards and containers
- [ ] **Elevated Surface**: `#f8fafc` (slate-50) for subtle elevation
- [ ] **NO custom colors** outside defined palette

#### **Accent Color Implementation**
- [ ] **Primary Accent**: `#6366f1` (indigo-500) for primary actions only
- [ ] **Success Accent**: `#22c55e` (green-500) for confirmations and success states
- [ ] **Warning Accent**: `#f59e0b` (amber-500) for cautions (if applicable)
- [ ] **Info Accent**: `#3b82f6` (blue-500) for informational elements
- [ ] **Error Accent**: `#ef4444` (red-500) for error states
- [ ] **Pastel Variants**: Light versions (`#a5b4fc`, `#86efac`) used appropriately

#### **Text Color Hierarchy**
- [ ] **Primary Text**: `#0f172a` (slate-700) for main content
- [ ] **Secondary Text**: `#334155` (slate-500) for supporting content
- [ ] **Tertiary Text**: `#64748b` (slate-400) for subtle information
- [ ] **Disabled Text**: `#94a3b8` (slate-300) for inactive elements
- [ ] **Inverse Text**: `#ffffff` (white) on dark backgrounds only

#### **Border & Divider Colors**
- [ ] **Primary Border**: `#e2e8f0` (slate-200) for standard borders
- [ ] **Subtle Border**: `#cbd5e1` (slate-150) for minimal divisions
- [ ] **Hover Border**: `#94a3b8` (slate-200) for interactive states
- [ ] **Focus Border**: Accent colors at 100% intensity

### **🔤 Typography System Compliance**

#### **Font Family Implementation**
- [ ] **Primary Font**: `"Aptos"` with proper fallback chain
- [ ] **Monospace Font**: `"Aptos Mono"` for system messages and code
- [ ] **Font Loading**: Preconnect and display=swap implemented
- [ ] **Fallback Fonts**: System fonts properly configured

#### **Font Weight Hierarchy**
- [ ] **Light (400)**: Minimal use, placeholder text only
- [ ] **Normal (450)**: Base body text weight
- [ ] **Medium (500)**: Standard UI elements and labels
- [ ] **Semibold (550)**: Emphasis and secondary headings
- [ ] **Bold (600)**: Important elements and primary headings
- [ ] **Extrabold (650)**: Major section headings
- [ ] **Black (700)**: Page titles and primary headings
- [ ] **Heavy (800)**: Maximum emphasis, minimal use

#### **Font Size Implementation**
- [ ] **Caption (13px)**: Helper text and annotations
- [ ] **Small (14px)**: Secondary information and labels
- [ ] **Body Secondary (15px)**: Supporting content
- [ ] **Body (16px)**: Primary body text
- [ ] **Button (15px)**: Interactive element text
- [ ] **H4 (18px)**: Minor section headings
- [ ] **H3 (20px)**: Section headings
- [ ] **H2 (24px)**: Major section headings
- [ ] **H1 (32px)**: Page titles and primary headings

#### **Line Height & Spacing**
- [ ] **Line Heights**: Appropriate for each font size (1.2-1.6)
- [ ] **Letter Spacing**: Subtle adjustments for readability
- [ ] **Text Balance**: Proper text wrapping and flow

### **📏 Spacing System Compliance**

#### **Spacing Scale Validation**
- [ ] **XS (4px)**: Minimal spacing, icon gaps
- [ ] **SM (8px)**: Small element spacing
- [ ] **MD (16px)**: Standard component spacing
- [ ] **LG (24px)**: Section spacing
- [ ] **XL (32px)**: Major layout spacing
- [ ] **2XL (48px)**: Large section breaks
- [ ] **3XL (64px)**: Maximum spacing for emphasis

#### **Component Spacing**
- [ ] **Card Padding**: 24px mobile, 32px desktop
- [ ] **Button Padding**: Appropriate touch targets (44px minimum height)
- [ ] **Form Element Spacing**: Consistent gaps and alignment
- [ ] **Grid Gutters**: Consistent spacing in layout systems

### **🎨 Component Design Compliance**

#### **Card & Container Standards**
- [ ] **Background**: Pure white (`#ffffff`) with subtle shadows
- [ ] **Shadow Implementation**: Defined shadow variables used
- [ ] **Border Radius**: 16px standard, 12px for smaller elements
- [ ] **Padding**: Design system spacing values only
- [ ] **Hover States**: Subtle shadow increases, no color changes

#### **Button Design Standards**
- [ ] **Primary Buttons**: Accent background, white text, 12px radius
- [ ] **Secondary Buttons**: White background, accent border and text
- [ ] **Tertiary Buttons**: Transparent background, accent text
- [ ] **Height Standards**: 44px minimum for touch accessibility
- [ ] **Hover States**: Appropriate color variations
- [ ] **Disabled States**: 50% opacity, disabled cursor

#### **Form Element Standards**
- [ ] **Input Fields**: White background, subtle borders, 12px radius
- [ ] **Focus States**: Accent border with subtle glow effect
- [ ] **Label Positioning**: Above inputs, proper font size and weight
- [ ] **Helper Text**: Below inputs, tertiary color, smaller font
- [ ] **Error States**: Error color applied to borders and text

#### **Typography Component Standards**
- [ ] **Headers**: Generous margin-bottom, proper hierarchy
- [ ] **Body Text**: Comfortable line-height, max 65ch width
- [ ] **Links**: Accent color with subtle hover underlines
- [ ] **Code/Monospace**: Subtle background, proper font family

## **🎭 Stage-Specific Design Validation**

### **Reflection/Input Stage Compliance**
- [ ] **Layout**: Single focus card, 600px max-width, centered
- [ ] **Question Typography**: H2 weight, primary text color
- [ ] **Textarea**: Minimum 120px height, comfortable padding
- [ ] **Primary Action**: Full accent color, prominent placement
- [ ] **Background**: Clean slate-50, no competing elements
- [ ] **Card Design**: White surface, proper shadow, 16px radius

### **Processing Stage Compliance**
- [ ] **Layout**: Centered minimal design, 400px max-width
- [ ] **System Message**: Aptos Mono font, secondary text color
- [ ] **Animation**: Simple opacity pulse, no flashy effects
- [ ] **Loading Indicator**: Accent-colored elements, subtle animation
- [ ] **Chrome Reduction**: Minimal navigation, focus on process
- [ ] **Background**: Consistent with overall design

### **Review Stage Compliance**
- [ ] **Layout**: Expanded width (1000px+), proper grid system
- [ ] **Grid Implementation**: CSS Grid with consistent gutters
- [ ] **Field Cards**: Individual white cards with proper spacing
- [ ] **Edit States**: Clear visual differentiation for edit mode
- [ ] **Color-Coded Badges**: Impact levels with defined color scheme
- [ ] **Action Hierarchy**: Clear primary/secondary button distinction
- [ ] **Typography**: Proper hierarchy throughout all fields

### **Success Stage Compliance**
- [ ] **Success Color**: Appropriate green accent integration
- [ ] **Typography**: H2 confirmation message with proper weight
- [ ] **Layout**: Centered content with appropriate spacing
- [ ] **Next Action**: Obvious call-to-action with accent color
- [ ] **Celebration**: Professional tone, not overwhelming
- [ ] **API Response Display**: Monospace font, proper formatting

## **📱 Responsive Design Validation**

### **Mobile (320px-768px) Compliance**
- [ ] **Single Column Layout**: No horizontal scrolling
- [ ] **Touch Targets**: 44px minimum for all interactive elements
- [ ] **Font Sizes**: Appropriate scaling for small screens
- [ ] **Spacing**: Reduced but proportional spacing
- [ ] **Card Padding**: 24px on mobile devices
- [ ] **Button Sizing**: Full-width or appropriate mobile sizing

### **Tablet (768px-1024px) Compliance**
- [ ] **Optimized Spacing**: Increased spacing for larger screens
- [ ] **Typography**: Proper scaling for tablet viewing
- [ ] **Layout Adjustments**: Appropriate use of available space
- [ ] **Touch Targets**: Maintained minimum sizes
- [ ] **Grid Systems**: Responsive grid implementations

### **Desktop (1024px+) Compliance**
- [ ] **Multi-Column Grids**: Effective use of horizontal space
- [ ] **Hover States**: Proper hover effects for mouse interaction
- [ ] **Keyboard Navigation**: Tab order and focus indicators
- [ ] **Typography**: Full scale implementation
- [ ] **Spacing**: Desktop spacing values (32px card padding)

### **Ultra-wide (1400px+) Compliance**
- [ ] **Max-Width Constraints**: Prevent excessive stretching
- [ ] **Content Centering**: Appropriate use of whitespace
- [ ] **Reading Line Length**: Comfortable text line limits
- [ ] **Layout Balance**: Proper content-to-whitespace ratio

## **♿ Accessibility Compliance Audit**

### **Color Accessibility**
- [ ] **Contrast Ratios**: WCAG 2.1 AA compliance (4.5:1 minimum)
- [ ] **Text Contrast**: Primary text 21:1, body text 7:1
- [ ] **Interactive Elements**: Sufficient contrast for all states
- [ ] **Color Independence**: Information not conveyed by color alone

### **Keyboard Navigation**
- [ ] **Tab Order**: Logical progression through interface
- [ ] **Focus Indicators**: 2px accent outline, 2px offset
- [ ] **Escape Key**: Proper modal and edit state handling
- [ ] **Enter Key**: Form submission and action triggers
- [ ] **Arrow Keys**: Appropriate navigation where applicable

### **Screen Reader Support**
- [ ] **Semantic HTML**: Proper heading hierarchy (h1-h6)
- [ ] **ARIA Labels**: Descriptive labels for interactive elements
- [ ] **Status Announcements**: Dynamic content updates announced
- [ ] **Alt Text**: Descriptive text for all meaningful images
- [ ] **Form Labels**: Proper association with form inputs

### **Motor Accessibility**
- [ ] **Touch Targets**: 44px minimum for all interactive elements
- [ ] **Click Areas**: Sufficient spacing between clickable elements
- [ ] **Hover Tolerance**: Forgiving hover states and timeouts
- [ ] **Focus Management**: Clear focus states for all interactions

## **⚡ Performance & Technical Compliance**

### **Font Loading Optimization**
```html
<!-- Required in public/index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;450;500;550;600;650;700;800&family=Aptos+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### **CSS Implementation Standards**
- [ ] **Custom Properties**: Proper CSS variable usage
- [ ] **Tailwind Classes**: Exclusive use of design system utilities
- [ ] **No Custom CSS**: All styling through Tailwind or design tokens
- [ ] **Component Classes**: Proper use of .btn-base, .input-base utilities

### **Animation Performance**
- [ ] **Transform/Opacity Only**: Hardware-accelerated properties
- [ ] **60fps Target**: Smooth animations across all devices
- [ ] **Subtle Effects**: Professional, not distracting
- [ ] **Reduced Motion**: Respect for user preferences

## **🧪 Design System Testing Protocol**

### **Visual Regression Testing**
```bash
# Design compliance testing commands
npm run test:visual
npm run test:accessibility
npm run test:responsive
```

### **Manual Testing Checklist**
- [ ] **Color Picker Validation**: Verify hex values match design system
- [ ] **Typography Inspection**: Font family, weight, and size verification
- [ ] **Spacing Measurement**: Confirm spacing matches design tokens
- [ ] **Component Consistency**: Cross-reference with design specifications
- [ ] **Responsive Behavior**: Test all breakpoints thoroughly

### **Browser Testing Requirements**
- [ ] **Chrome**: Latest version compatibility
- [ ] **Firefox**: Latest version compatibility
- [ ] **Safari**: Latest version compatibility (iOS and macOS)
- [ ] **Edge**: Latest version compatibility
- [ ] **Mobile Browsers**: iOS Safari, Chrome Mobile

### **Accessibility Testing Tools**
```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react pa11y lighthouse-ci

# Run accessibility audits
npm run test:a11y
npx pa11y http://localhost:3000
npx lighthouse-ci
```

## **📋 Compliance Validation Scripts**

### **Color Validation Script**
```javascript
// Design system color validation
const validateColors = () => {
  const elements = document.querySelectorAll('*');
  const approvedColors = [
    '#f1f5f9', '#e2e8f0', '#ffffff', '#f8fafc',
    '#6366f1', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444',
    '#0f172a', '#334155', '#64748b', '#94a3b8'
  ];
  
  elements.forEach(el => {
    const styles = getComputedStyle(el);
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;
    
    // Validate colors match design system
    // Implementation details...
  });
};
```

### **Typography Validation Script**
```javascript
// Font and typography validation
const validateTypography = () => {
  const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
  
  textElements.forEach(el => {
    const styles = getComputedStyle(el);
    const fontFamily = styles.fontFamily;
    const fontSize = styles.fontSize;
    const fontWeight = styles.fontWeight;
    
    // Validate against design system standards
    // Implementation details...
  });
};
```

### **Spacing Validation Script**
```javascript
// Spacing and layout validation
const validateSpacing = () => {
  const approvedSpacing = ['4px', '8px', '16px', '24px', '32px', '48px', '64px'];
  
  // Check margins, padding, gaps against approved values
  // Implementation details...
};
```

## **📝 Compliance Report Template**

### **Design Audit Results**
```markdown
## Design System Compliance Report

### Color Compliance: ✅ / ❌
- Background colors: [Status]
- Accent colors: [Status] 
- Text hierarchy: [Status]
- Border colors: [Status]

### Typography Compliance: ✅ / ❌
- Font families: [Status]
- Weight hierarchy: [Status]
- Size progression: [Status]
- Line heights: [Status]

### Spacing Compliance: ✅ / ❌
- Component spacing: [Status]
- Layout spacing: [Status]
- Responsive spacing: [Status]

### Component Compliance: ✅ / ❌
- Cards & containers: [Status]
- Buttons: [Status]
- Form elements: [Status]
- Typography components: [Status]

### Accessibility Compliance: ✅ / ❌
- Color contrast: [Status]
- Keyboard navigation: [Status]
- Screen reader support: [Status]
- Motor accessibility: [Status]

### Issues Found: [Number]
[Detailed list of non-compliant elements with recommendations]
```

## **✅ Success Criteria**

### **Complete Design Compliance**
- [ ] 100% color palette adherence across all components
- [ ] Typography hierarchy properly implemented
- [ ] Spacing system consistently applied
- [ ] Component design standards met
- [ ] Responsive design requirements fulfilled

### **Accessibility Standards**
- [ ] WCAG 2.1 AA compliance achieved
- [ ] Keyboard navigation fully functional
- [ ] Screen reader compatibility verified
- [ ] Motor accessibility requirements met

### **Performance Standards**
- [ ] Font loading optimized for performance
- [ ] Animation performance at 60fps
- [ ] Critical CSS properly implemented
- [ ] Design system utilities load efficiently

### **Cross-Platform Consistency**
- [ ] Identical appearance across all supported browsers
- [ ] Responsive behavior consistent on all devices
- [ ] Touch interactions work properly on mobile
- [ ] Hover states function correctly on desktop

---

**Execute this comprehensive design compliance audit to ensure the Resume Achievement Logger meets the highest standards of visual design, user experience, and accessibility while strictly adhering to the established design system principles.**