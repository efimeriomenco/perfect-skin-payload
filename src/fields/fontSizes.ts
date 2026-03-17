/**
 * Shared fluid font size definitions using CSS clamp().
 *
 * Each size smoothly scales between a min (mobile ~320px) and max (desktop ~1280px)
 * using the formula: clamp(min, base + scale·vw, max)
 *
 * This avoids hard breakpoint jumps — the modern standard for responsive typography.
 */

/** CSS values for TextStateFeature config (hyphenated keys) */
export const fontSizeState = {
  '14px': {
    label: '14px',
    css: {
      'font-size': 'clamp(0.75rem, 0.73rem + 0.1vw, 0.875rem)',
      'line-height': '1.5',
    },
  },
  '16px': {
    label: '16px',
    css: {
      'font-size': 'clamp(0.875rem, 0.83rem + 0.21vw, 1rem)',
      'line-height': '1.5',
    },
  },
  '18px': {
    label: '18px',
    css: {
      'font-size': 'clamp(0.938rem, 0.88rem + 0.31vw, 1.125rem)',
      'line-height': '1.5',
    },
  },
  '20px': {
    label: '20px',
    css: {
      'font-size': 'clamp(1rem, 0.92rem + 0.42vw, 1.25rem)',
      'line-height': '1.5',
    },
  },
  '24px': {
    label: '24px',
    css: {
      'font-size': 'clamp(1.125rem, 1rem + 0.63vw, 1.5rem)',
      'line-height': '1.4',
    },
  },
  '28px': {
    label: '28px',
    css: {
      'font-size': 'clamp(1.25rem, 1.08rem + 0.83vw, 1.75rem)',
      'line-height': '1.4',
    },
  },
  '32px': {
    label: '32px',
    css: {
      'font-size': 'clamp(1.375rem, 1.17rem + 1.04vw, 2rem)',
      'line-height': '1.3',
    },
  },
  '36px': {
    label: '36px',
    css: {
      'font-size': 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)',
      'line-height': '1.3',
    },
  },
  '40px': {
    label: '40px',
    css: {
      'font-size': 'clamp(1.625rem, 1.33rem + 1.46vw, 2.5rem)',
      'line-height': '1.25',
    },
  },
  '48px': {
    label: '48px',
    css: {
      'font-size': 'clamp(1.875rem, 1.5rem + 1.88vw, 3rem)',
      'line-height': '1.2',
    },
  },
  '56px': {
    label: '56px',
    css: {
      'font-size': 'clamp(2.125rem, 1.67rem + 2.29vw, 3.5rem)',
      'line-height': '1.15',
    },
  },
  '64px': {
    label: '64px',
    css: {
      'font-size': 'clamp(2.375rem, 1.83rem + 2.71vw, 4rem)',
      'line-height': '1.1',
    },
  },
  '72px': {
    label: '72px',
    css: {
      'font-size': 'clamp(2.625rem, 2rem + 3.13vw, 4.5rem)',
      'line-height': '1.1',
    },
  },
} as const

/** CSS values for TextStateFeature font weight config (hyphenated keys) */
export const fontWeightState = {
  '100': { label: 'Thin (100)', css: { 'font-weight': '100' } },
  '200': { label: 'Extra Light (200)', css: { 'font-weight': '200' } },
  '300': { label: 'Light (300)', css: { 'font-weight': '300' } },
  '400': { label: 'Regular (400)', css: { 'font-weight': '400' } },
  '500': { label: 'Medium (500)', css: { 'font-weight': '500' } },
  '600': { label: 'Semi Bold (600)', css: { 'font-weight': '600' } },
  '700': { label: 'Bold (700)', css: { 'font-weight': '700' } },
  '800': { label: 'Extra Bold (800)', css: { 'font-weight': '800' } },
  '900': { label: 'Black (900)', css: { 'font-weight': '900' } },
} as const

/** React CSSProperties for the frontend serializer (camelCase keys) */
export const fontWeightStyles: Record<string, React.CSSProperties> = {
  '100': { fontWeight: 100 },
  '200': { fontWeight: 200 },
  '300': { fontWeight: 300 },
  '400': { fontWeight: 400 },
  '500': { fontWeight: 500 },
  '600': { fontWeight: 600 },
  '700': { fontWeight: 700 },
  '800': { fontWeight: 800 },
  '900': { fontWeight: 900 },
}

/** React CSSProperties for the frontend serializer (camelCase keys) */
export const fontSizeStyles: Record<string, React.CSSProperties> = {
  '14px': { fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.875rem)', lineHeight: '1.5' },
  '16px': { fontSize: 'clamp(0.875rem, 0.83rem + 0.21vw, 1rem)', lineHeight: '1.5' },
  '18px': { fontSize: 'clamp(0.938rem, 0.88rem + 0.31vw, 1.125rem)', lineHeight: '1.5' },
  '20px': { fontSize: 'clamp(1rem, 0.92rem + 0.42vw, 1.25rem)', lineHeight: '1.5' },
  '24px': { fontSize: 'clamp(1.125rem, 1rem + 0.63vw, 1.5rem)', lineHeight: '1.4' },
  '28px': { fontSize: 'clamp(1.25rem, 1.08rem + 0.83vw, 1.75rem)', lineHeight: '1.4' },
  '32px': { fontSize: 'clamp(1.375rem, 1.17rem + 1.04vw, 2rem)', lineHeight: '1.3' },
  '36px': { fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)', lineHeight: '1.3' },
  '40px': { fontSize: 'clamp(1.625rem, 1.33rem + 1.46vw, 2.5rem)', lineHeight: '1.25' },
  '48px': { fontSize: 'clamp(1.875rem, 1.5rem + 1.88vw, 3rem)', lineHeight: '1.2' },
  '56px': { fontSize: 'clamp(2.125rem, 1.67rem + 2.29vw, 3.5rem)', lineHeight: '1.15' },
  '64px': { fontSize: 'clamp(2.375rem, 1.83rem + 2.71vw, 4rem)', lineHeight: '1.1' },
  '72px': { fontSize: 'clamp(2.625rem, 2rem + 3.13vw, 4.5rem)', lineHeight: '1.1' },
}
