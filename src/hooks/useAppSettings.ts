import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Preferensi bahasa quote
export type LanguagePref = 'all' | 'id' | 'en';

const LANG_STORAGE_KEY = '@titikkoma_lang';
const CURHAT_COUNT_KEY = '@titikkoma_curhat_count';
const NOTIF_ENABLED_KEY = '@titikkoma_notif_enabled';
const NOTIF_TIME_KEY = '@titikkoma_notif_time';

export type NotificationTime = '08:00' | '12:00' | '20:00';

interface AppSettings {
  langPref: LanguagePref;
  curhatCount: number;
  notificationEnabled: boolean;
  notificationTime: NotificationTime;
}

interface UseAppSettingsReturn extends AppSettings {
  isLoading: boolean;
  setLangPref: (lang: LanguagePref) => Promise<void>;
  incrementCurhatCount: () => Promise<void>;
  setNotificationEnabled: (enabled: boolean) => Promise<void>;
  setNotificationTime: (time: NotificationTime) => Promise<void>;
}

/**
 * Hook master untuk pengaturan aplikasi umum.
 * Mengelola preferensi bahasa quote dan statistik penggunaan.
 */
export const useAppSettings = (): UseAppSettingsReturn => {
  const [langPref, setLangPrefState] = useState<LanguagePref>('all');
  const [curhatCount, setCurhatCount] = useState(0);
  const [notificationEnabled, setNotifEnabledState] = useState(false);
  const [notificationTime, setNotifTimeState] = useState<NotificationTime>('08:00');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Muat semua pengaturan secara paralel
    Promise.all([
      AsyncStorage.getItem(LANG_STORAGE_KEY),
      AsyncStorage.getItem(CURHAT_COUNT_KEY),
      AsyncStorage.getItem(NOTIF_ENABLED_KEY),
      AsyncStorage.getItem(NOTIF_TIME_KEY),
    ]).then(([lang, count, notifEnabled, notifTime]) => {
      if (lang === 'id' || lang === 'en' || lang === 'all') {
        setLangPrefState(lang);
      }
      if (count) {
        setCurhatCount(parseInt(count, 10) || 0);
      }
      if (notifEnabled !== null) {
        setNotifEnabledState(notifEnabled === 'true');
      }
      if (notifTime === '08:00' || notifTime === '12:00' || notifTime === '20:00') {
        setNotifTimeState(notifTime);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error("Gagal memuat pengaturan:", error);
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

  const setNotificationEnabled = async (enabled: boolean) => {
    setNotifEnabledState(enabled);
    await AsyncStorage.setItem(NOTIF_ENABLED_KEY, String(enabled));
  };

  const setNotificationTime = async (time: NotificationTime) => {
    setNotifTimeState(time);
    await AsyncStorage.setItem(NOTIF_TIME_KEY, time);
  };

  return { 
    langPref, 
    curhatCount, 
    notificationEnabled, 
    notificationTime, 
    isLoading, 
    setLangPref, 
    incrementCurhatCount, 
    setNotificationEnabled, 
    setNotificationTime 
  };
};
