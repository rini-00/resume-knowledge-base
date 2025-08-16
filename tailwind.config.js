/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./agent/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'aptos': ['"Aptos"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'aptos-mono': ['"Aptos Mono"', '"SF Mono"', 'Monaco', '"Cascadia Code"', 'monospace'],
        'sans': ['"Aptos"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['"Aptos Mono"', '"SF Mono"', 'Monaco', '"Cascadia Code"', 'monospace'],
      },
      fontWeight: {
        'light': '400',
        'normal': '450',
        'medium': '500',
        'semibold': '550',
        'bold': '600',
        'extrabold': '650',
        'black': '700',
        'heavy': '800',
      },
      fontSize: {
        'caption': ['13px', { lineHeight: '1.4' }],
        'small': ['14px', { lineHeight: '1.5' }],
        'body-secondary': ['15px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'button': ['15px', { lineHeight: '1.4' }],
        'input-label': ['14px', { lineHeight: '1.4' }],
        'h4': ['18px', { lineHeight: '1.4' }],
        'h3': ['20px', { lineHeight: '1.4' }],
        'h2': ['24px', { lineHeight: '1.3' }],
        'h1': ['32px', { lineHeight: '1.2' }],
      },
      colors: {
        // Enhanced slate scale for backgrounds
        slate: {
          25: '#fafafa',
          50: '#f8fafc',
          75: '#f1f5f9',
          100: '#e2e8f0',
          150: '#cbd5e1',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          800: '#020617',
          900: '#000000',
        },
        // Custom accent colors
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'subtle': '8px',
        'standard': '12px',
        'medium': '16px',
        'large': '20px',
        'xl-custom': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(15, 23, 42, 0.05)',
        'standard': '0 4px 6px rgba(15, 23, 42, 0.07)',
        'elevated': '0 10px 15px rgba(15, 23, 42, 0.1)',
        'prominent': '0 20px 25px rgba(15, 23, 42, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulseSlow 2s ease-in-out infinite',
        'icon-pulse': 'iconPulse 2s ease-in-out infinite',
        'dot-pulse': 'dotPulse 1.4s ease-in-out infinite both',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        pulseSlow: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.6',
          },
        },
        iconPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8',
          },
        },
        dotPulse: {
          '0%, 80%, 100%': {
            transform: 'scale(0.8)',
            opacity: '0.5',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1680px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropBlur: {
        'xs': '2px',
      },
      aspectRatio: {
        'card': '4 / 3',
        'banner': '3 / 1',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'wide': '0.01em',
        'wider': '0.02em',
      },
      lineHeight: {
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
      },
    },
  },
  plugins: [
    // Custom plugin for design system utilities
    function({ addUtilities, addComponents, theme }) {
      // Add custom utilities
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.font-feature-small-caps': {
          'font-feature-settings': '"smcp" 1',
        },
        '.font-feature-tabular-nums': {
          'font-feature-settings': '"tnum" 1',
        },
      });

      // Add custom components
      addComponents({
        '.btn-base': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.button')[0],
          lineHeight: theme('fontSize.button')[1].lineHeight,
          minHeight: '44px',
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          paddingTop: theme('spacing.3'),
          paddingBottom: theme('spacing.3'),
          borderRadius: theme('borderRadius.xl'),
          transitionProperty: 'all',
          transitionDuration: '200ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.input-base': {
          width: '100%',
          padding: theme('spacing.3'),
          fontSize: theme('fontSize.body')[0],
          lineHeight: theme('fontSize.body')[1].lineHeight,
          fontWeight: theme('fontWeight.normal'),
          color: theme('colors.slate.700'),
          backgroundColor: theme('colors.white'),
          border: `1px solid ${theme('colors.slate.300')}`,
          borderRadius: theme('borderRadius.xl'),
          transitionProperty: 'all',
          transitionDuration: '200ms',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.indigo.500'),
            boxShadow: `0 0 0 2px ${theme('colors.indigo.500')}40`,
          },
          '&::placeholder': {
            color: theme('colors.slate.400'),
            fontWeight: theme('fontWeight.light'),
          },
        },
      });
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
}