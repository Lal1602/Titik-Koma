import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, AppTheme, THEMES } from '../constants/themes';

interface ThemeContextValue {
  themeMode: ThemeMode;
  theme: AppTheme;
  toggleTheme: () => void;
}

// Nilai default context — digunakan saat ThemeProvider belum termuat
const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'midnight',
  theme: THEMES.midnight,
  toggleTheme: () => {},
});

const STORAGE_KEY = '@titikkoma_theme';

/**
 * Provider yang membungkus seluruh aplikasi di _layout.tsx.
 * Menyimpan dan memuat preferensi tema dari AsyncStorage.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('midnight');

  useEffect(() => {
    // Muat tema tersimpan saat pertama kali app dibuka
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved === 'kertas' || saved === 'midnight') {
        setThemeMode(saved);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next: ThemeMode = themeMode === 'midnight' ? 'kertas' : 'midnight';
    setThemeMode(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, theme: THEMES[themeMode], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook untuk mengakses tema di komponen manapun.
 * Komponen harus berada di dalam ThemeProvider.
 */
export const useTheme = () => useContext(ThemeContext);
