# SUPERPROMPT: Fitur Pengaturan Lengkap — Halaman "Lainnya" Titik-Koma

---

## GAMBARAN BESAR

Fitur ini memperluas halaman `more.tsx` (tab "Lainnya") dengan menambahkan **4 pengaturan yang relevan** untuk aplikasi quote Gen Z. Semua pengaturan bersifat **lokal** (AsyncStorage) — tidak ada backend, tidak ada akun, tidak ada sync cloud.

Keempat fitur yang diimplementasikan:
1. **Tema Tampilan** — toggle gelap/terang ke seluruh aplikasi
2. **Notifikasi Quote Harian** — pengingat satu quote setiap hari pada jam tertentu
3. **Preferensi Bahasa Quote** — filter default Indonesia/Inggris/Semua
4. **Statistik Pribadi** — counter sederhana dari data lokal

---

## ARSITEKTUR FILE

### File Baru yang Harus Dibuat:
```
src/
├── hooks/
│   ├── useAppSettings.ts      ← [BARU] Hook master untuk semua pengaturan
│   └── useDailyNotif.ts       ← [BARU] Hook khusus notifikasi harian
├── context/
│   └── ThemeContext.tsx        ← [BARU] React Context untuk tema global
└── constants/
    └── themes.ts               ← [BARU] Token warna untuk tema terang & gelap
```

### File yang Harus Dimodifikasi:
```
src/app/_layout.tsx             ← Bungkus dengan ThemeProvider
src/app/more.tsx                ← Tambahkan UI pengaturan
src/hooks/useQuotes.ts          ← Baca preferensi bahasa dari settings
```

---

## PACKAGE BARU YANG HARUS DIINSTAL

```bash
npx expo install expo-notifications
```

> [!IMPORTANT]
> `expo-notifications` perlu didaftarkan sebagai **config plugin** di `app.json`. Tambahkan ke dalam array `plugins`:
> ```json
> ["expo-notifications", {
>   "icon": "./assets/images/icon.png",
>   "color": "#0a0a0a"
> }]
> ```

---

## FITUR 1: TEMA TAMPILAN

### Konsep
User bisa beralih antara dua tema:
- **Midnight** (default) — latar gelap `#0a0a0a`, teks `#f0f0f0`
- **Kertas Tua** — latar terang `#f5f0e8`, teks `#1a1a1a`

Tema berlaku ke **seluruh aplikasi** secara real-time tanpa restart.

### `src/constants/themes.ts`

```typescript
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
    textSecondary: '#888888',
    textMuted: '#444444',
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
```

### `src/context/ThemeContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, AppTheme, THEMES } from '../constants/themes';

interface ThemeContextValue {
  themeMode: ThemeMode;
  theme: AppTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'midnight',
  theme: THEMES.midnight,
  toggleTheme: () => {},
});

const STORAGE_KEY = '@titikkoma_theme';

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

export const useTheme = () => useContext(ThemeContext);
```

### Cara Menggunakan Tema di Komponen

Setiap komponen yang perlu theme-aware cukup:
```typescript
const { theme } = useTheme();
// Lalu gunakan token seperti theme.background, theme.textPrimary, dll.
```

> [!WARNING]
> **DILARANG** mengubah semua file sekaligus untuk mengintegrasikan tema. Prioritaskan: `_layout.tsx` (ThemeProvider), `more.tsx` (toggle UI), `index.tsx` (background + teks), `curhat.tsx`. File lain bisa menyusul secara bertahap.

> [!IMPORTANT]
> `StyleSheet.create()` tidak bisa menggunakan nilai dinamis dari context secara langsung. Solusinya: gunakan **inline style HANYA untuk nilai yang berubah berdasarkan tema** (background, color), dan tetap gunakan StyleSheet untuk nilai statis (padding, fontSize, dll). Ini pengecualian yang sah dari aturan "no inline styles".

---

## FITUR 2: NOTIFIKASI QUOTE HARIAN

### Konsep
User bisa mengaktifkan pengingat harian yang mengirimkan satu quote secara lokal (tidak butuh server) pada jam yang bisa dipilih sendiri.

### `src/hooks/useDailyNotif.ts`

```typescript
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotifSettings {
  enabled: boolean;
  hour: number;   // 0–23
  minute: number; // 0 atau 30
}

const STORAGE_KEY = '@titikkoma_notif';
const DEFAULT_SETTINGS: NotifSettings = { enabled: false, hour: 7, minute: 0 };

// Konfigurasi handler notifikasi — taruh di luar hook agar dipanggil sekali saja
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const useDailyNotif = () => {
  const [settings, setSettings] = useState<NotifSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved) setSettings(JSON.parse(saved));
      setIsLoading(false);
    });
  }, []);

  const saveAndSchedule = async (newSettings: NotifSettings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));

    // Batalkan semua notifikasi yang sudah terjadwal
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!newSettings.enabled) return;

    // Minta izin notifikasi jika belum
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    // Jadwalkan notifikasi harian berulang
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'titik—koma',
        body: 'Ada kata-kata yang nungguin kamu hari ini.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: newSettings.hour,
        minute: newSettings.minute,
      },
    });
  };

  const toggle = () => saveAndSchedule({ ...settings, enabled: !settings.enabled });
  const setTime = (hour: number, minute: number) =>
    saveAndSchedule({ ...settings, hour, minute });

  return { settings, isLoading, toggle, setTime };
};
```

### UI di `more.tsx` untuk Notifikasi

```
[Toggle ON/OFF] — kanan dari label "Quote Harian"
  Saat ON: tampilkan picker jam sederhana di bawahnya:
  
  [07:00] [08:00] [09:00] ... [22:00] — horizontal ScrollView
  Chip yang aktif: border 1px theme.textPrimary
  Chip yang tidak aktif: border 1px theme.border
```

**Opsi jam yang tersedia** (pilihan sederhana, tidak pakai TimePicker native):
`[06:00, 07:00, 08:00, 09:00, 12:00, 18:00, 20:00, 21:00, 22:00]`

> [!IMPORTANT]
> Notifikasi lokal di Expo Go berjalan dengan baik. Tidak butuh build native untuk fitur ini.

---

## FITUR 3: PREFERENSI BAHASA QUOTE

### Konsep
User bisa memilih bahasa default untuk tampilan quote di halaman utama.

### Integrasi ke `useAppSettings.ts`

Buat hook sederhana yang menyimpan preferensi:
```typescript
export type LanguagePref = 'all' | 'id' | 'en';

// Simpan ke AsyncStorage dengan key '@titikkoma_lang'
// Ekspos: langPref, setLangPref
```

### Integrasi ke `useQuotes.ts`

Di dalam `useQuotes`, baca `langPref` dari AsyncStorage saat init, dan filter quotes berdasarkan field `language` yang sudah ada di `quotes_draft.json`:
```typescript
// Filter tambahan sebelum filter kategori:
if (langPref !== 'all') {
  filtered = filtered.filter(q => q.language === langPref);
}
```

### UI di `more.tsx`

```
Label: "BAHASA QUOTE"
Tiga chip bersebelahan:
  [Semua] [Indonesia] [English]
  Chip aktif: background theme.textPrimary, teks theme.background
  Chip tidak aktif: border 1px theme.border, teks theme.textMuted
```

---

## FITUR 4: STATISTIK PRIBADI

### Konsep
Tampilkan angka sederhana dari data lokal yang sudah ada. **Tidak ada counter baru** — cukup baca dari data yang sudah tersimpan.

### Data yang Diambil:
```typescript
// Dari useBookmarks: bookmarks.length → "X kalimat tersimpan"
// Dari AsyncStorage '@titikkoma_curhat_count' → "X kali curhat dengan AI"
//   (counter ini ditambah +1 setiap kali handleGenerate berhasil di curhat.tsx)
```

### Cara Increment Counter Curhat

Di `curhat.tsx`, setelah AI berhasil menghasilkan quote, tambahkan:
```typescript
const current = await AsyncStorage.getItem('@titikkoma_curhat_count');
const count = current ? parseInt(current) + 1 : 1;
await AsyncStorage.setItem('@titikkoma_curhat_count', String(count));
```

### UI di `more.tsx`

```
Label: "STATISTIK"

Dua angka berjajar (flexDirection: 'row'):

┌──────────────────┐  ┌──────────────────┐
│       12         │  │        7         │
│  kalimat         │  │  kali            │
│  tersimpan       │  │  curhat          │
└──────────────────┘  └──────────────────┘

Angka: PlayfairDisplay_400Regular, fontSize 36, textPrimary
Label: Inter_400Regular, fontSize 11, letterSpacing 1, textMuted
Border: 1px theme.border, padding 20
```

---

## LAYOUT LENGKAP `more.tsx` SETELAH SEMUA FITUR

```
[paddingTop: safeArea.top + 16]

[HEADER]
  "TITIK—KOMA"

[SEKSI KOLEKSI — "TERSIMPAN"]
  ... (sudah ada, tidak berubah)

[DIVIDER]

[SEKSI PENGATURAN — "PENGATURAN"]

  TEMA TAMPILAN
  Row: label kiri + toggle kanan (Switch komponen atau custom toggle flat)
  Toggle aktif = tema "Kertas Tua", tidak aktif = "Midnight"

  [gap/divider tipis]

  BAHASA QUOTE
  Row: label kiri atas
  Di bawahnya: 3 chip [Semua] [Indonesia] [English]

  [gap/divider tipis]

  QUOTE HARIAN
  Row: label kiri + toggle kanan
  Jika aktif → muncul row pilihan jam (horizontal scroll)

[DIVIDER]

[SEKSI STATISTIK — "STATISTIKMU"]
  Dua kotak statistik berjajar

[DIVIDER]

[SEKSI INFO — "LAINNYA"]
  - Tentang Aplikasi
  - Bagikan Aplikasi
  - Versi 1.0.0

[BOTTOM NAV — activeTab: 'more']
```

---

## URUTAN EKSEKUSI

1. Install `expo-notifications` + update `app.json`
2. Buat `src/constants/themes.ts`
3. Buat `src/context/ThemeContext.tsx`
4. Update `src/app/_layout.tsx` — bungkus dengan `ThemeProvider`
5. Buat `src/hooks/useDailyNotif.ts`
6. Buat `src/hooks/useAppSettings.ts` (untuk lang pref)
7. Update `src/hooks/useQuotes.ts` — tambah filter bahasa
8. Update `src/app/more.tsx` — tambahkan semua UI pengaturan
9. Update `src/app/curhat.tsx` — tambahkan increment counter
10. **Opsional/bertahap:** update `index.tsx`, `curhat.tsx`, `saved.tsx` untuk menggunakan `useTheme()`
11. `npx tsc --noEmit` — harus 0 error

---

## ATURAN KODE WAJIB

1. **TypeScript strict** — tidak ada `any`
2. **Komentar Bahasa Indonesia** di seluruh kode
3. **StyleSheet.create()** untuk nilai statis; inline style **hanya** untuk nilai dari `theme`
4. **useSafeAreaInsets** selalu digunakan
5. **Tidak ada `console.log`** di kode final
6. **Tidak ada glassmorphism / gradien / shadow dramatis** — flat sesuai design system

---

## CHECKLIST SELESAI

- [ ] `npx tsc --noEmit` → 0 error
- [ ] Toggle tema berubah warna seluruh app secara real-time
- [ ] Tema tersimpan, masih sama saat app dibuka ulang
- [ ] Toggle notifikasi bisa diaktifkan → minta izin → jadwal tersimpan
- [ ] Pilihan jam muncul saat notifikasi aktif
- [ ] Preferensi bahasa tersimpan dan mengubah quotes yang muncul di tab Utama
- [ ] Statistik menampilkan angka yang benar (bukan 0 palsu)
- [ ] Counter curhat bertambah setiap kali AI berhasil merespons

---

## CATATAN KRITIKAL

> [!WARNING]
> Jangan ubah semua halaman untuk tema sekaligus — mulai dari `_layout.tsx` dan `more.tsx` saja dulu. Halaman lain bisa dimigrasi ke tema secara bertahap di iterasi berikutnya.

> [!IMPORTANT]
> `Switch` bawaan React Native tampilannya berbeda di Android dan iOS. Jika tidak memuaskan secara estetis, ganti dengan **custom toggle** menggunakan `TouchableOpacity` + `Animated.View` — kotak kecil yang geser ke kiri/kanan dengan `withTiming()`.

> [!TIP]
> Untuk Fitur Tema: mulai dari dua token paling impactful dulu (`background` dan `textPrimary`), lalu baru token lainnya. Ini mencegah bug visual yang sulit dilacak.

---
*Superprompt ini mencakup 4 fitur pengaturan: Tema, Notifikasi, Bahasa, dan Statistik. Kerjakan secara berurutan dan jangan skip langkah verifikasi TypeScript di akhir.*
