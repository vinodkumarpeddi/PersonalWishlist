export const colors = {
  brand: {
    DEFAULT: '#6C5CE7',
    light: '#A29BFE',
    dark: '#4834D4',
  },
  accent: {
    DEFAULT: '#00D2D3',
    light: '#55E6C1',
    dark: '#01A3A4',
  },
  surface: {
    DEFAULT: '#12121A',
    light: '#1A1A25',
    dark: '#0A0A0F',
  },
  muted: {
    DEFAULT: '#6B7280',
    light: '#9CA3AF',
  },
  white: '#FFFFFF',
  black: '#000000',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#FF6B6B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
