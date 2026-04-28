import { Platform } from 'react-native';

export const lightColors = {
  background:    '#F0F4F8',
  surface:       '#FFFFFF',
  surfaceAlt:    '#EDF2F7',
  border:        '#E2E8F0',
  text:          '#0F172A',
  textSecondary: '#475569',
  textMuted:     '#94A3B8',
  positive:      '#059669',
  negative:      '#DC2626',
  accent:        '#2563EB',
  accentSoft:    '#EFF6FF',
  warning:       '#D97706',
  warningBg:     '#FFFBEB',
  tint:          '#2563EB',
  icon:          '#475569',
  tabIconDefault:  '#94A3B8',
  tabIconSelected: '#2563EB',
  heroGrad:      ['#1D4ED8', '#2563EB', '#3B82F6'] as string[],
  isDark: false,
};

export const darkColors = {
  background:    '#0F172A',
  surface:       '#1E293B',
  surfaceAlt:    '#273549',
  border:        '#334155',
  text:          '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted:     '#64748B',
  positive:      '#10B981',
  negative:      '#F87171',
  accent:        '#38BDF8',
  accentSoft:    '#0C1E30',
  warning:       '#FBBF24',
  warningBg:     '#1C1500',
  tint:          '#38BDF8',
  icon:          '#94A3B8',
  tabIconDefault:  '#475569',
  tabIconSelected: '#38BDF8',
  heroGrad:      ['#0F172A', '#1E293B', '#0F172A'] as string[],
  isDark: true,
};

export type ThemeColors = typeof lightColors;

// Shorthand for non-color structural constants
export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
};

export const Radius = {
  sm: 8, md: 12, lg: 20,
};

export const FontSize = {
  xs: 11, sm: 12, md: 14, lg: 16, xl: 20, xxl: 26, xxxl: 32,
};

export function cardShadow(isDark: boolean) {
  if (isDark) return {};
  return Platform.select({
    ios: {
      shadowColor: '#94A3B8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {
      shadowColor: '#94A3B8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
  }) ?? {};
}

// Legacy compat — used during migration
export const Colors = { light: lightColors, dark: darkColors };
export const C = darkColors;
