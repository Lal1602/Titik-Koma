// Token warna untuk setiap tema aplikasi
// Digunakan oleh ThemeContext dan semua komponen yang theme-aware

export type ThemeMode = 'midnight' | 'kertas';

export interface AppTheme {
  background: string;
  surface: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textGhost: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder: string;
}

export const THEMES: Record<ThemeMode, AppTheme> = {
  midnight: {
    background: '#0a0a0a',
    surface: '#111111',
    border: '#1e1e1e',
    borderSubtle: '#111111',
    textPrimary: '#f0f0f0',
    textSecondary: '#a0a0a0',
    textMuted: '#666666',
    textGhost: '#2a2a2a',
    buttonBg: '#000000',
    buttonText: '#f0f0f0',
    buttonBorder: '#333333',
  },
  kertas: {
    background: '#f5f0e8',
    surface: '#ede8e0',
    border: '#d4c9b0',
    borderSubtle: '#e8e3da',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#999999',
    textGhost: '#c4b89a',
    buttonBg: '#f5f0e8',
    buttonText: '#1a1a1a',
    buttonBorder: '#d4c9b0',
  },
};
