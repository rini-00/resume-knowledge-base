#!/usr/bin/env node
/**
 * Frontend validation script for the Resume Knowledge Base project.
 * Validates React components, builds, and frontend functionality.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

class FrontendValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.totalChecks = 0;
        this.passedChecks = 0;
        this.failedChecks = 0;
    }

    log(level, message) {
        switch (level) {
            case 'PASS':
                console.log(`${colors.green}✓ ${message}${colors.reset}`);
                this.passedChecks++;
                break;
            case 'FAIL':
                console.log(`${colors.red}✗ ${message}${colors.reset}`);
                this.failedChecks++;
                this.errors.push(message);
                break;
            case 'WARN':
                console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
                this.warnings.push(message);
                break;
            case 'INFO':
                console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
                break;
            default:
                console.log(message);
        }
        this.totalChecks++;
    }

    async fileExists(filePath) {
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    async readFile(filePath) {
        try {
            return await fs.promises.readFile(filePath, 'utf8');
        } catch (error) {
            this.log('WARN', `Could not read file: ${filePath}`);
            return '';
        }
    }

    runCommand(command, description) {
        try {
            const output = execSync(command, { 
                encoding: 'utf8', 
                stdio: 'pipe',
                timeout: 30000 
            });
            this.log('PASS', `${description}: Command executed successfully`);
            return { success: true, output };
        } catch (error) {
            this.log('FAIL', `${description}: ${error.message}`);
            return { success: false, output: error.message };
        }
    }

    async checkProjectStructure() {
        console.log(`\n${colors.cyan}📁 Checking project structure${colors.reset}`);
        
        const requiredFiles = [
            'package.json',
            'src/index.css',
            'agent/ResumeLogger.jsx',
            'public/index.html'
        ];

        const optionalFiles = [
            'src/App.js',
            'webpack.config.js',
            'tailwind.config.js',
            '.eslintrc.js',
            '.prettierrc'
        ];

        // Check required files
        for (const file of requiredFiles) {
            if (await this.fileExists(file)) {
                this.log('PASS', `Required file exists: ${file}`);
            } else {
                this.log('FAIL', `Required file missing: ${file}`);
            }
        }

        // Check optional files
        for (const file of optionalFiles) {
            if (await this.fileExists(file)) {
                this.log('PASS', `Optional file exists: ${file}`);
            } else {
                this.log('WARN', `Optional file missing: ${file}`);
            }
        }
    }

    async checkPackageJson() {
        console.log(`\n${colors.cyan}📦 Checking package.json${colors.reset}`);
        
        if (await this.fileExists('package.json')) {
            const packageContent = await this.readFile('package.json');
            
            try {
                const packageData = JSON.parse(packageContent);
                
                // Check essential dependencies
                const requiredDeps = ['react', 'react-dom'];
                const devDeps = ['@babel/core', 'webpack', 'webpack-cli'];
                
                if (packageData.dependencies) {
                    requiredDeps.forEach(dep => {
                        if (packageData.dependencies[dep]) {
                            this.log('PASS', `Required dependency found: ${dep}`);
                        } else {
                            this.log('FAIL', `Missing required dependency: ${dep}`);
                        }
                    });
                } else {
                    this.log('FAIL', 'No dependencies section found in package.json');
                }

                // Check dev dependencies
                if (packageData.devDependencies) {
                    devDeps.forEach(dep => {
                        if (packageData.devDependencies[dep]) {
                            this.log('PASS', `Dev dependency found: ${dep}`);
                        } else {
                            this.log('WARN', `Missing dev dependency: ${dep}`);
                        }
                    });
                }

                // Check scripts
                const requiredScripts = ['start', 'build'];
                if (packageData.scripts) {
                    requiredScripts.forEach(script => {
                        if (packageData.scripts[script]) {
                            this.log('PASS', `Script found: ${script}`);
                        } else {
                            this.log('FAIL', `Missing script: ${script}`);
                        }
                    });
                } else {
                    this.log('FAIL', 'No scripts section found in package.json');
                }

            } catch (error) {
                this.log('FAIL', `Invalid JSON in package.json: ${error.message}`);
            }
        } else {
            this.log('FAIL', 'package.json not found');
        }
    }

    async checkReactComponent() {
        console.log(`\n${colors.cyan}⚛️ Checking React component${colors.reset}`);
        
        const componentPath = 'agent/ResumeLogger.jsx';
        
        if (await this.fileExists(componentPath)) {
            const componentContent = await this.readFile(componentPath);
            
            // Check for React imports
            if (componentContent.includes('import React') || componentContent.includes('from "react"')) {
                this.log('PASS', 'React import found');
            } else {
                this.log('WARN', 'No React import found - may be using new JSX transform');
            }

            // Check for hooks usage
            const hooks = ['useState', 'useEffect', 'useCallback', 'useMemo'];
            let foundHooks = 0;
            hooks.forEach(hook => {
                if (componentContent.includes(hook)) {
                    foundHooks++;
                }
            });
            
            if (foundHooks > 0) {
                this.log('PASS', `React hooks found: ${foundHooks} different hooks`);
            } else {
                this.log('WARN', 'No React hooks found');
            }

            // Check for component export
            if (componentContent.includes('export default') || componentContent.includes('export {')) {
                this.log('PASS', 'Component export found');
            } else {
                this.log('FAIL', 'No component export found');
            }

            // Check for JSX syntax
            if (componentContent.includes('<') && componentContent.includes('>')) {
                this.log('PASS', 'JSX syntax found');
            } else {
                this.log('FAIL', 'No JSX syntax found');
            }

            // Check for Tailwind classes
            const tailwindPattern = /className=["'][^"']*(?:bg-|text-|p-|m-|flex|grid|rounded)/;
            if (tailwindPattern.test(componentContent)) {
                this.log('PASS', 'Tailwind CSS classes found');
            } else {
                this.log('WARN', 'No Tailwind CSS classes found');
            }

            // Check for form elements
            const formElements = ['input', 'textarea', 'button', 'form'];
            let foundFormElements = 0;
            formElements.forEach(element => {
                if (componentContent.includes(`<${element}`)) {
                    foundFormElements++;
                }
            });
            
            if (foundFormElements > 0) {
                this.log('PASS', `Form elements found: ${foundFormElements} types`);
            } else {
                this.log('WARN', 'No form elements found');
            }

        } else {
            this.log('FAIL', 'React component file not found');
        }
    }

    async checkCSS() {
        console.log(`\n${colors.cyan}🎨 Checking CSS and styling${colors.reset}`);
        
        const cssPath = 'src/index.css';
        
        if (await this.fileExists(cssPath)) {
            const cssContent = await this.readFile(cssPath);
            
            // Check for Tailwind directives
            const tailwindDirectives = ['@tailwind base', '@tailwind components', '@tailwind utilities'];
            tailwindDirectives.forEach(directive => {
                if (cssContent.includes(directive)) {
                    this.log('PASS', `Tailwind directive found: ${directive}`);
                } else {
                    this.log('WARN', `Tailwind directive missing: ${directive}`);
                }
            });

            // Check for font imports
            if (cssContent.includes('@import') || cssContent.includes('url(')) {
                this.log('PASS', 'Font imports found');
            } else {
                this.log('WARN', 'No font imports found');
            }

            // Check for Aptos font
            if (cssContent.includes('Aptos') || cssContent.includes('aptos')) {
                this.log('PASS', 'Aptos font family found');
            } else {
                this.log('WARN', 'Aptos font family not found');
            }

            // Check for custom CSS (shouldn't be too much with Tailwind)
            const lines = cssContent.split('\n').filter(line => 
                line.trim() && 
                !line.trim().startsWith('@') && 
                !line.trim().startsWith('/*') &&
                !line.trim().startsWith('*/')
            );
            
            if (lines.length < 50) {
                this.log('PASS', `Minimal custom CSS: ${lines.length} custom lines`);
            } else {
                this.log('WARN', `Significant custom CSS: ${lines.length} lines - consider using Tailwind utilities`);
            }

        } else {
            this.log('FAIL', 'Main CSS file not found');
        }
    }

    async checkBuildConfiguration() {
        console.log(`\n${colors.cyan}⚙️ Checking build configuration${colors.reset}`);
        
        // Check for Webpack config
        if (await this.fileExists('webpack.config.js')) {
            this.log('PASS', 'Webpack configuration found');
            
            const webpackContent = await this.readFile('webpack.config.js');
            
            // Check for essential webpack configurations
            const webpackFeatures = [
                'entry',
                'output',
                'module',
                'rules',
                'babel-loader',
                'css-loader'
            ];
            
            webpackFeatures.forEach(feature => {
                if (webpackContent.includes(feature)) {
                    this.log('PASS', `Webpack feature configured: ${feature}`);
                } else {
                    this.log('WARN', `Webpack feature missing: ${feature}`);
                }
            });
            
        } else {
            this.log('WARN', 'Webpack configuration not found');
        }

        // Check for Tailwind config
        if (await this.fileExists('tailwind.config.js')) {
            this.log('PASS', 'Tailwind configuration found');
            
            const tailwindContent = await this.readFile('tailwind.config.js');
            
            if (tailwindContent.includes('content:') || tailwindContent.includes('purge:')) {
                this.log('PASS', 'Tailwind content configuration found');
            } else {
                this.log('WARN', 'Tailwind content configuration missing');
            }
            
        } else {
            this.log('WARN', 'Tailwind configuration not found');
        }
    }

    async runLinting() {
        console.log(`\n${colors.cyan}🔍 Running linting checks${colors.reset}`);
        
        // Check if ESLint is available
        try {
            const eslintResult = this.runCommand('npm list eslint --depth=0', 'ESLint availability check');
            if (eslintResult.success) {
                // Run ESLint
                const lintResult = this.runCommand('npx eslint agent/ src/ --ext .js,.jsx', 'ESLint validation');
                if (!lintResult.success && lintResult.output.includes('No files matching')) {
                    this.log('WARN', 'ESLint: No matching files found');
                }
            }
        } catch (error) {
            this.log('WARN', 'ESLint not available - skipping lint checks');
        }

        // Check if Prettier is available
        try {
            const prettierResult = this.runCommand('npm list prettier --depth=0', 'Prettier availability check');
            if (prettierResult.success) {
                // Run Prettier check
                this.runCommand('npx prettier --check agent/ src/', 'Prettier format check');
            }
        } catch (error) {
            this.log('WARN', 'Prettier not available - skipping format checks');
        }
    }

    async testBuild() {
        console.log(`\n${colors.cyan}🏗️ Testing build process${colors.reset}`);
        
        // Check if node_modules exists
        if (await this.fileExists('node_modules')) {
            this.log('PASS', 'node_modules directory exists');
        } else {
            this.log('WARN', 'node_modules not found - running npm install');
            this.runCommand('npm install', 'Installing dependencies');
        }

        // Test build command
        try {
            const buildResult = this.runCommand('npm run build', 'Build process test');
            if (buildResult.success) {
                // Check if build output exists
                const buildPaths = ['dist/', 'build/', 'public/'];
                let foundBuildOutput = false;
                
                for (const buildPath of buildPaths) {
                    if (await this.fileExists(buildPath)) {
                        this.log('PASS', `Build output found: ${buildPath}`);
                        foundBuildOutput = true;
                        break;
                    }
                }
                
                if (!foundBuildOutput) {
                    this.log('WARN', 'No build output directory found');
                }
            }
        } catch (error) {
            this.log('FAIL', `Build process failed: ${error.message}`);
        }
    }

    async checkAccessibility() {
        console.log(`\n${colors.cyan}♿ Checking accessibility features${colors.reset}`);
        
        const componentPath = 'agent/ResumeLogger.jsx';
        
        if (await this.fileExists(componentPath)) {
            const componentContent = await this.readFile(componentPath);
            
            // Check for accessibility attributes
            const a11yFeatures = [
                'aria-label',
                'aria-describedby',
                'role=',
                'alt=',
                'htmlFor=',
                'id='
            ];
            
            let foundA11yFeatures = 0;
            a11yFeatures.forEach(feature => {
                if (componentContent.includes(feature)) {
                    foundA11yFeatures++;
                }
            });
            
            if (foundA11yFeatures > 0) {
                this.log('PASS', `Accessibility features found: ${foundA11yFeatures} types`);
            } else {
                this.log('WARN', 'No accessibility features found');
            }

            // Check for keyboard navigation
            const keyboardFeatures = ['onKeyDown', 'onKeyPress', 'tabIndex'];
            let foundKeyboardFeatures = 0;
            keyboardFeatures.forEach(feature => {
                if (componentContent.includes(feature)) {
                    foundKeyboardFeatures++;
                }
            });
            
            if (foundKeyboardFeatures > 0) {
                this.log('PASS', `Keyboard navigation features: ${foundKeyboardFeatures} types`);
            } else {
                this.log('WARN', 'No keyboard navigation features found');
            }

            // Check for semantic HTML
            const semanticElements = ['<header', '<nav', '<main', '<section', '<article', '<footer'];
            let foundSemantic = 0;
            semanticElements.forEach(element => {
                if (componentContent.includes(element)) {
                    foundSemantic++;
                }
            });
            
            if (foundSemantic > 0) {
                this.log('PASS', `Semantic HTML elements: ${foundSemantic} types`);
            } else {
                this.log('WARN', 'No semantic HTML elements found');
            }
        }
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log(`${colors.blue}FRONTEND VALIDATION SUMMARY${colors.reset}`);
        console.log('='.repeat(60));
        
        console.log(`Total Checks: ${this.totalChecks}`);
        console.log(`${colors.green}Passed: ${this.passedChecks}${colors.reset}`);
        console.log(`${colors.red}Failed: ${this.failedChecks}${colors.reset}`);
        console.log(`${colors.yellow}Warnings: ${this.warnings.length}${colors.reset}`);
        
        if (this.errors.length > 0) {
            console.log(`\n${colors.red}🚨 ERRORS FOUND:${colors.reset}`);
            this.errors.forEach((error, index) => {
                console.log(`${colors.red}${index + 1}. ${error}${colors.reset}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log(`\n${colors.yellow}⚠️ WARNINGS:${colors.reset}`);
            this.warnings.forEach((warning, index) => {
                console.log(`${colors.yellow}${index + 1}. ${warning}${colors.reset}`);
            });
        }
        
        if (this.failedChecks === 0) {
            console.log(`\n${colors.green}🎉 Frontend validation completed successfully!${colors.reset}`);
            console.log(`${colors.green}✅ All critical checks passed${colors.reset}`);
            return 0;
        } else {
            console.log(`\n${colors.red}❌ Frontend validation failed${colors.reset}`);
            console.log(`${colors.red}🔧 Fix the errors above before deployment${colors.reset}`);
            return 1;
        }
    }

    async run() {
        console.log(`${colors.blue}🚀 Starting Frontend Validation${colors.reset}`);
        console.log('='.repeat(60));
        
        try {
            await this.checkProjectStructure();
            await this.checkPackageJson();
            await this.checkReactComponent();
            await this.checkCSS();
            await this.checkBuildConfiguration();
            await this.runLinting();
            await this.testBuild();
            await this.checkAccessibility();
            
            const exitCode = this.printSummary();
            process.exit(exitCode);
            
        } catch (error) {
            console.error(`${colors.red}Error during frontend validation: ${error.message}${colors.reset}`);
            console.error(error.stack);
            process.exit(1);
        }
    }
}

// Run the frontend validator
if (require.main === module) {
    const validator = new FrontendValidator();
    validator.run();
}

module.exports = FrontendValidator;