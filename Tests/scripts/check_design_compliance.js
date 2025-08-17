#!/usr/bin/env node
/**
 * Design compliance checker for the Resume Knowledge Base project.
 * Validates adherence to the design system and visual standards.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Design system configuration
const designSystem = {
    colors: {
        primary: {
            slate: ['#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'],
            indigo: ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3']
        },
        surface: '#ffffff',
        background: '#f8fafc'
    },
    fonts: {
        primary: 'Aptos',
        fallbacks: ['system-ui', 'sans-serif']
    },
    spacing: {
        scale: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32'],
        semantic: {
            xs: '0.25rem',
            sm: '0.5rem', 
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem'
        }
    },
    borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
    }
};

class DesignComplianceChecker {
    constructor() {
        this.violations = [];
        this.totalChecks = 0;
        this.passedChecks = 0;
        this.failedChecks = 0;
    }

    log(level, message) {
        const timestamp = new Date().toISOString();
        switch (level) {
            case 'PASS':
                console.log(`${colors.green}✓ ${message}${colors.reset}`);
                this.passedChecks++;
                break;
            case 'FAIL':
                console.log(`${colors.red}✗ ${message}${colors.reset}`);
                this.failedChecks++;
                this.violations.push(message);
                break;
            case 'WARN':
                console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
                break;
            case 'INFO':
                console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
                break;
            default:
                console.log(message);
        }
        this.totalChecks++;
    }

    async checkFileExists(filePath) {
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    async readFileContent(filePath) {
        try {
            return await fs.promises.readFile(filePath, 'utf8');
        } catch (error) {
            this.log('WARN', `Could not read file: ${filePath}`);
            return '';
        }
    }

    checkColorUsage(content, filePath) {
        console.log(`\n${colors.cyan}🎨 Checking color usage in ${filePath}${colors.reset}`);
        
        // Check for design system colors
        const designSystemColors = [
            ...designSystem.colors.primary.slate,
            ...designSystem.colors.primary.indigo,
            designSystem.colors.surface,
            designSystem.colors.background
        ];

        let foundDesignSystemColors = 0;
        designSystemColors.forEach(color => {
            if (content.includes(color)) {
                foundDesignSystemColors++;
            }
        });

        if (foundDesignSystemColors > 0) {
            this.log('PASS', `Design system colors found: ${foundDesignSystemColors} instances`);
        }

        // Check for hardcoded colors (potential violations)
        const hardcodedColorPattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
        const hardcodedColors = content.match(hardcodedColorPattern) || [];
        
        const violationColors = hardcodedColors.filter(color => 
            !designSystemColors.some(dsColor => dsColor.toLowerCase() === color.toLowerCase())
        );

        if (violationColors.length === 0) {
            this.log('PASS', 'No hardcoded color violations found');
        } else {
            this.log('FAIL', `Hardcoded colors found: ${violationColors.join(', ')}`);
        }

        // Check for Tailwind color classes
        const tailwindColorPattern = /(?:bg|text|border)-(?:slate|indigo|gray|white|black)-(?:\d{2,3})/g;
        const tailwindColors = content.match(tailwindColorPattern) || [];
        
        if (tailwindColors.length > 0) {
            this.log('PASS', `Tailwind color classes found: ${tailwindColors.length} instances`);
        }
    }

    checkFontUsage(content, filePath) {
        console.log(`\n${colors.cyan}🔤 Checking font usage in ${filePath}${colors.reset}`);
        
        // Check for Aptos font family
        if (content.includes('Aptos') || content.includes('aptos')) {
            this.log('PASS', 'Aptos font family configured');
        } else {
            this.log('WARN', 'Aptos font family not found');
        }

        // Check for font fallbacks
        const fallbackFonts = ['system-ui', 'sans-serif'];
        let foundFallbacks = 0;
        fallbackFonts.forEach(font => {
            if (content.includes(font)) {
                foundFallbacks++;
            }
        });

        if (foundFallbacks > 0) {
            this.log('PASS', `Font fallbacks configured: ${foundFallbacks} found`);
        } else {
            this.log('WARN', 'No font fallbacks found');
        }

        // Check for responsive text sizing
        const responsiveTextPattern = /text-(?:xs|sm|base|lg|xl|2xl|3xl)(?:\s|$)/g;
        const responsiveText = content.match(responsiveTextPattern) || [];
        
        if (responsiveText.length > 0) {
            this.log('PASS', `Responsive text sizing: ${responsiveText.length} instances`);
        }
    }

    checkSpacing(content, filePath) {
        console.log(`\n${colors.cyan}📏 Checking spacing usage in ${filePath}${colors.reset}`);
        
        // Check for consistent spacing classes
        const spacingPattern = /(?:p|m|space|gap)-(?:\d+|xs|sm|md|lg|xl)/g;
        const spacingClasses = content.match(spacingPattern) || [];
        
        if (spacingClasses.length > 0) {
            this.log('PASS', `Spacing classes found: ${spacingClasses.length} instances`);
        } else {
            this.log('WARN', 'No spacing classes found');
        }

        // Check for semantic spacing usage
        const semanticSpacing = ['xs', 'sm', 'md', 'lg', 'xl'];
        let foundSemantic = 0;
        semanticSpacing.forEach(size => {
            const pattern = new RegExp(`-${size}(?:\\s|$)`, 'g');
            if (pattern.test(content)) {
                foundSemantic++;
            }
        });

        if (foundSemantic > 0) {
            this.log('PASS', `Semantic spacing used: ${foundSemantic} different sizes`);
        }

        // Check for hardcoded spacing values (potential violations)
        const hardcodedSpacingPattern = /(?:padding|margin|gap):\s*(\d+(?:px|rem|em))/g;
        const hardcodedSpacing = content.match(hardcodedSpacingPattern) || [];
        
        if (hardcodedSpacing.length === 0) {
            this.log('PASS', 'No hardcoded spacing violations found');
        } else {
            this.log('FAIL', `Hardcoded spacing found: ${hardcodedSpacing.join(', ')}`);
        }
    }

    checkBorderRadius(content, filePath) {
        console.log(`\n${colors.cyan}🔘 Checking border radius usage in ${filePath}${colors.reset}`);
        
        // Check for consistent border radius classes
        const borderRadiusPattern = /rounded(?:-(?:none|sm|md|lg|xl|full))?/g;
        const borderRadiusClasses = content.match(borderRadiusPattern) || [];
        
        if (borderRadiusClasses.length > 0) {
            this.log('PASS', `Border radius classes found: ${borderRadiusClasses.length} instances`);
        }

        // Check for hardcoded border radius values
        const hardcodedRadiusPattern = /border-radius:\s*(\d+(?:px|rem|%))/g;
        const hardcodedRadius = content.match(hardcodedRadiusPattern) || [];
        
        if (hardcodedRadius.length === 0) {
            this.log('PASS', 'No hardcoded border radius violations found');
        } else {
            this.log('FAIL', `Hardcoded border radius found: ${hardcodedRadius.join(', ')}`);
        }
    }

    checkResponsiveDesign(content, filePath) {
        console.log(`\n${colors.cyan}📱 Checking responsive design in ${filePath}${colors.reset}`);
        
        // Check for responsive breakpoint usage
        const breakpoints = Object.keys(designSystem.breakpoints);
        let foundBreakpoints = 0;
        
        breakpoints.forEach(bp => {
            const pattern = new RegExp(`${bp}:`, 'g');
            if (pattern.test(content)) {
                foundBreakpoints++;
            }
        });

        if (foundBreakpoints > 0) {
            this.log('PASS', `Responsive breakpoints used: ${foundBreakpoints} different sizes`);
        } else {
            this.log('WARN', 'No responsive breakpoints found');
        }

        // Check for mobile-first approach (base classes without prefixes)
        const mobileFirstPattern = /(?:^|\s)(?:flex|grid|p-|m-|text-)(?:\d+|xs|sm|md|lg|xl)/g;
        const mobileFirstClasses = content.match(mobileFirstPattern) || [];
        
        if (mobileFirstClasses.length > 0) {
            this.log('PASS', `Mobile-first classes found: ${mobileFirstClasses.length} instances`);
        }

        // Check for responsive utilities
        const responsiveUtilities = [
            'hidden', 'block', 'flex', 'grid',
            'w-full', 'w-auto', 'h-auto',
            'text-center', 'text-left', 'text-right'
        ];

        let foundResponsiveUtilities = 0;
        responsiveUtilities.forEach(utility => {
            breakpoints.forEach(bp => {
                if (content.includes(`${bp}:${utility}`)) {
                    foundResponsiveUtilities++;
                }
            });
        });

        if (foundResponsiveUtilities > 0) {
            this.log('PASS', `Responsive utilities found: ${foundResponsiveUtilities} instances`);
        }
    }

    checkAccessibility(content, filePath) {
        console.log(`\n${colors.cyan}♿ Checking accessibility in ${filePath}${colors.reset}`);
        
        // Check for semantic HTML elements
        const semanticElements = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
        let foundSemantic = 0;
        
        semanticElements.forEach(element => {
            if (content.includes(`<${element}`)) {
                foundSemantic++;
            }
        });

        if (foundSemantic > 0) {
            this.log('PASS', `Semantic HTML elements found: ${foundSemantic} types`);
        }

        // Check for accessibility attributes
        const a11yAttributes = ['aria-label', 'aria-describedby', 'role', 'alt=', 'title='];
        let foundA11yAttrs = 0;
        
        a11yAttributes.forEach(attr => {
            if (content.includes(attr)) {
                foundA11yAttrs++;
            }
        });

        if (foundA11yAttrs > 0) {
            this.log('PASS', `Accessibility attributes found: ${foundA11yAttrs} types`);
        }

        // Check for focus management
        const focusClasses = ['focus:outline', 'focus:ring', 'focus:border'];
        let foundFocusClasses = 0;
        
        focusClasses.forEach(focusClass => {
            if (content.includes(focusClass)) {
                foundFocusClasses++;
            }
        });

        if (foundFocusClasses > 0) {
            this.log('PASS', `Focus management classes found: ${foundFocusClasses} types`);
        } else {
            this.log('WARN', 'No focus management classes found');
        }
    }

    async checkTailwindConfig() {
        console.log(`\n${colors.cyan}⚙️ Checking Tailwind configuration${colors.reset}`);
        
        const configPath = 'tailwind.config.js';
        if (await this.checkFileExists(configPath)) {
            const configContent = await this.readFileContent(configPath);
            
            // Check for theme customization
            if (configContent.includes('theme') && configContent.includes('extend')) {
                this.log('PASS', 'Tailwind theme customization found');
            } else {
                this.log('WARN', 'No Tailwind theme customization found');
            }

            // Check for custom colors
            if (configContent.includes('colors')) {
                this.log('PASS', 'Custom colors configuration found');
            }

            // Check for font family configuration
            if (configContent.includes('fontFamily') && configContent.includes('Aptos')) {
                this.log('PASS', 'Aptos font configured in Tailwind');
            } else {
                this.log('WARN', 'Aptos font not configured in Tailwind');
            }

        } else {
            this.log('WARN', 'Tailwind config file not found');
        }
    }

    async checkMainCSS() {
        console.log(`\n${colors.cyan}🎨 Checking main CSS file${colors.reset}`);
        
        const cssPath = 'src/index.css';
        if (await this.checkFileExists(cssPath)) {
            const cssContent = await this.readFileContent(cssPath);
            
            this.checkColorUsage(cssContent, cssPath);
            this.checkFontUsage(cssContent, cssPath);
            this.checkSpacing(cssContent, cssPath);
            
        } else {
            this.log('WARN', 'Main CSS file not found at src/index.css');
        }
    }

    async checkReactComponents() {
        console.log(`\n${colors.cyan}⚛️ Checking React components${colors.reset}`);
        
        const componentPaths = [
            'agent/ResumeLogger.jsx',
            'src/App.js'
        ];

        for (const componentPath of componentPaths) {
            if (await this.checkFileExists(componentPath)) {
                const componentContent = await this.readFileContent(componentPath);
                
                console.log(`\nAnalyzing ${componentPath}:`);
                this.checkColorUsage(componentContent, componentPath);
                this.checkSpacing(componentContent, componentPath);
                this.checkBorderRadius(componentContent, componentPath);
                this.checkResponsiveDesign(componentContent, componentPath);
                this.checkAccessibility(componentContent, componentPath);
                
            } else {
                this.log('WARN', `Component file not found: ${componentPath}`);
            }
        }
    }

    printViolations() {
        if (this.violations.length > 0) {
            console.log(`\n${colors.red}📋 DESIGN VIOLATIONS FOUND:${colors.reset}`);
            console.log('='.repeat(60));
            this.violations.forEach((violation, index) => {
                console.log(`${colors.red}${index + 1}. ${violation}${colors.reset}`);
            });
        }
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log(`${colors.blue}DESIGN COMPLIANCE SUMMARY${colors.reset}`);
        console.log('='.repeat(60));
        
        console.log(`Total Checks: ${this.totalChecks}`);
        console.log(`${colors.green}Passed: ${this.passedChecks}${colors.reset}`);
        console.log(`${colors.red}Failed: ${this.failedChecks}${colors.reset}`);
        console.log(`${colors.red}Violations: ${this.violations.length}${colors.reset}`);
        
        this.printViolations();
        
        if (this.failedChecks === 0 && this.violations.length === 0) {
            console.log(`\n${colors.green}🎉 All design compliance checks passed!${colors.reset}`);
            console.log(`${colors.green}✅ Design system compliance validated${colors.reset}`);
            return 0;
        } else {
            console.log(`\n${colors.red}⚠️  Design system violations found${colors.reset}`);
            console.log(`${colors.red}❌ Fix violations before deployment${colors.reset}`);
            return 1;
        }
    }

    async run() {
        console.log(`${colors.blue}🎨 Starting Design System Compliance Check${colors.reset}`);
        console.log('='.repeat(60));
        
        try {
            await this.checkTailwindConfig();
            await this.checkMainCSS();
            await this.checkReactComponents();
            
            const exitCode = this.printSummary();
            process.exit(exitCode);
            
        } catch (error) {
            console.error(`${colors.red}Error during design compliance check: ${error.message}${colors.reset}`);
            process.exit(1);
        }
    }
}

// Run the design compliance checker
if (require.main === module) {
    const checker = new DesignComplianceChecker();
    checker.run();
}

module.exports = DesignComplianceChecker;