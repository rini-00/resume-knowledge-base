module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react']
    }
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  rules: {
    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    'react/prop-types': 'warn', // Warn for missing prop types
    'react/jsx-uses-react': 'off', // Not needed with new JSX transform
    'react/jsx-uses-vars': 'error',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/no-children-prop': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'warn',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/no-unknown-property': 'error',
    'react/require-render-return': 'error',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies

    // General JavaScript rules
    'no-console': 'warn', // Warn about console.log statements
    'no-debugger': 'error', // No debugger statements
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-var': 'error', // Use let/const instead of var
    'prefer-const': 'warn', // Prefer const when variable is not reassigned
    'prefer-arrow-callback': 'warn', // Prefer arrow functions for callbacks
    'arrow-spacing': 'error', // Require space around arrow function arrows
    'comma-dangle': ['warn', 'never'], // No trailing commas
    'semi': ['error', 'always'], // Require semicolons
    'quotes': ['warn', 'single', { allowTemplateLiterals: true }], // Prefer single quotes
    'indent': ['warn', 2], // 2-space indentation
    'no-trailing-spaces': 'warn', // No trailing whitespace
    'eol-last': 'warn', // Require newline at end of file
    'object-curly-spacing': ['warn', 'always'], // Spaces inside object braces
    'array-bracket-spacing': ['warn', 'never'], // No spaces inside array brackets
    'computed-property-spacing': ['warn', 'never'], // No spaces inside computed properties

    // Best practices
    'eqeqeq': ['error', 'always'], // Require === and !==
    'curly': ['error', 'all'], // Require curly braces for all control statements
    'no-eval': 'error', // No eval()
    'no-implied-eval': 'error', // No implied eval()
    'no-with': 'error', // No with statements
    'no-loop-func': 'error', // No function declarations inside loops
    'no-script-url': 'error', // No javascript: urls
    'no-proto': 'error', // No __proto__
    'no-iterator': 'error', // No __iterator__
    'no-sequences': 'error', // No comma operator
    'no-throw-literal': 'error', // Throw Error objects
    'wrap-iife': ['error', 'inside'], // Wrap immediately invoked functions
    'yoda': ['error', 'never'], // No yoda conditions

    // Accessibility hints
    'jsx-a11y/alt-text': 'off', // Disabled - we'll handle this manually
    'jsx-a11y/anchor-has-content': 'off', // Disabled - we'll handle this manually
    'jsx-a11y/anchor-is-valid': 'off' // Disabled - we'll handle this manually
  },
  settings: {
    react: {
      version: 'detect' // Automatically detect React version
    }
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
      env: {
        jest: true
      }
    }
  ]
};