/**
 * Token warna, tipografi, dan spacing untuk aplikasi Titik-Koma.
 * Sesuai panduan design_system.md: Midnight Thoughts palette.
 */

export const Colors = {
  // Background
  bgMain: '#0a0a0a',
  bgSurface: '#111111',

  // Border
  borderSubtle: '#1e1e1e',
  borderVisible: '#333333',
  borderEmphasized: '#444444',

  // Text
  textPrimary: '#f0f0f0',
  textSecondary: '#888888',
  textMuted: '#444444',
  textAccent: '#f5f0e8',

  // UI
  white: '#ffffff',
  black: '#000000',
} as const;

export const FontFamily = {
  playfair: 'PlayfairDisplay_400Regular',
  playfairItalic: 'PlayfairDisplay_400Regular_Italic',
  playfairSemiBold: 'PlayfairDisplay_600SemiBold',
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interBold: 'Inter_700Bold',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 56,
} as const;
