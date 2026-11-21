/**
 * Shared design tokens. Single source of truth for both apps:
 *  - web reads them as CSS custom properties (see `toCssVariables`)
 *  - mobile reads them directly in StyleSheet objects
 *
 * Palette: deep navy (trust, seriousness), white space, and a restrained
 * saffron accent used only for highlights, progress and calls to action.
 */

export const palette = {
  navy950: '#050D24',
  navy900: '#0A1A3F',
  navy800: '#10265A',
  navy700: '#183474',
  navy600: '#22458F',
  navy500: '#3A5DA8',
  navy300: '#9FB2DA',
  navy100: '#E3E9F6',
  navy50: '#F3F6FC',

  saffron700: '#B85A00',
  saffron600: '#D96D00',
  saffron500: '#F28C1B',
  saffron400: '#F8A94A',
  saffron100: '#FFEBD3',
  saffron50: '#FFF7EE',

  white: '#FFFFFF',
  slate900: '#111827',
  slate700: '#374151',
  slate500: '#6B7280',
  slate400: '#9CA3AF',
  slate200: '#E5E7EB',
  slate100: '#F1F3F7',

  green600: '#16803C',
  green50: '#ECF8F0',
  red600: '#C62828',
  red50: '#FDEDED',
} as const;

/** Semantic colour roles. Components should use these, not raw palette values. */
export const colors = {
  background: palette.navy50,
  surface: palette.white,
  surfaceMuted: palette.slate100,
  border: palette.slate200,

  text: palette.slate900,
  textMuted: palette.slate500,
  textOnPrimary: palette.white,

  primary: palette.navy800,
  primaryStrong: palette.navy900,
  primarySoft: palette.navy100,

  accent: palette.saffron500,
  accentStrong: palette.saffron700,
  accentSoft: palette.saffron50,

  success: palette.green600,
  successSoft: palette.green50,
  danger: palette.red600,
  dangerSoft: palette.red50,
} as const;

export type ColorToken = keyof typeof colors;

/** 4-pt spacing scale. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

/**
 * Type scale. Devanagari needs slightly more line height than Latin,
 * so line heights are generous by default.
 */
export const typography = {
  fontFamily: {
    web: "var(--font-sans), 'Noto Sans Devanagari', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 34,
  },
  lineHeight: {
    xs: 18,
    sm: 21,
    md: 24,
    lg: 27,
    xl: 31,
    xxl: 38,
    display: 44,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const shadows = {
  card: {
    web: '0 1px 2px rgba(10, 26, 63, 0.06), 0 4px 16px rgba(10, 26, 63, 0.06)',
    native: {
      shadowColor: palette.navy900,
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
  },
} as const;

export const layout = {
  contentMaxWidth: 1180,
  sidebarWidth: 248,
  bottomNavHeight: 64,
} as const;

/** Accent colour per exam, used for badges and course card stripes. */
export const examColors = {
  'mpsc-group-c': palette.navy700,
  'mpsc-group-d': palette.saffron600,
  dmer: '#0E7C7B',
} as const;

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Serialise tokens as CSS custom properties for the web app. */
export function toCssVariables(): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(colors)) lines.push(`--color-${kebab(k)}: ${v};`);
  for (const [k, v] of Object.entries(spacing)) lines.push(`--space-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(radii)) lines.push(`--radius-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(typography.size)) lines.push(`--text-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(typography.lineHeight)) lines.push(`--leading-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(examColors)) lines.push(`--exam-${k}: ${v};`);
  lines.push(`--shadow-card: ${shadows.card.web};`);
  lines.push(`--font-stack: ${typography.fontFamily.web};`);
  lines.push(`--content-max: ${layout.contentMaxWidth}px;`);
  lines.push(`--sidebar-width: ${layout.sidebarWidth}px;`);
  lines.push(`--bottom-nav-height: ${layout.bottomNavHeight}px;`);
  return `:root{${lines.join('')}}`;
}

export const tokens = { palette, colors, spacing, radii, typography, shadows, layout, examColors };
