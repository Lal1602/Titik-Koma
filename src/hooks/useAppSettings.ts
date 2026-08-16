import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Preferensi bahasa quote
export type LanguagePref = 'all' | 'id' | 'en';

const LANG_STORAGE_KEY = '@titikkoma_lang';
const CURHAT_COUNT_KEY = '@titikkoma_curhat_count';

interface AppSettings {
  langPref: LanguagePref;
  curhatCount: number;
}

interface UseAppSettingsReturn extends AppSettings {
  isLoading: boolean;
  setLangPref: (lang: LanguagePref) => Promise<void>;
  incrementCurhatCount: () => Promise<void>;
}

/**
 * Hook master untuk pengaturan aplikasi umum.
 * Mengelola preferensi bahasa quote dan statistik penggunaan.
 */
export const useAppSettings = (): UseAppSettingsReturn => {
  const [langPref, setLangPrefState] = useState<LanguagePref>('all');
  const [curhatCount, setCurhatCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Muat semua pengaturan secara paralel
    Promise.all([
      AsyncStorage.getItem(LANG_STORAGE_KEY),
      AsyncStorage.getItem(CURHAT_COUNT_KEY),
    ]).then(([lang, count]) => {
      if (lang === 'id' || lang === 'en' || lang === 'all') {
        setLangPrefState(lang);
      }
      if (count) {
        setCurhatCount(parseInt(count, 10) || 0);
      }
      setIsLoading(false);
    });
  }, []);

  // Simpan preferensi bahasa ke AsyncStorage
  const setLangPref = async (lang: LanguagePref) => {
    setLangPrefState(lang);
    await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
  };

  // Tambah counter curhat sebanyak 1 — dipanggil dari curhat.tsx setelah AI berhasil
  const incrementCurhatCount = async () => {
    const next = curhatCount + 1;
    setCurhatCount(next);
    await AsyncStorage.setItem(CURHAT_COUNT_KEY, String(next));
  };

  return { langPref, curhatCount, isLoading, setLangPref, incrementCurhatCount };
};
