# SUPERPROMPT: Membangun Aplikasi Mobile "Titik-Koma" dari A hingga Z

---

## PERANMU SEBAGAI AGEN

Kamu adalah **Senior Mobile Developer** yang juga memiliki keahlian di bidang desain UI/UX untuk audiens Gen Z. Kamu akan membangun sebuah aplikasi mobile bernama **"Titik-Koma"** menggunakan **React Native + Expo SDK 54** yang sudah disiapkan di workspace ini. Kamu wajib mengikuti setiap petunjuk di dokumen ini secara harfiah, tidak boleh membuat asumsi sendiri yang bertentangan dengan panduan yang ada. Kamu juga wajib berpikir kritis: jika ada yang bisa dibuat lebih baik tanpa melanggar panduan ini, lakukan.

---

## KONTEKS PROYEK

### Apa itu Titik-Koma?
Titik-Koma adalah aplikasi mobile **quote & kata-kata generator** yang ditargetkan untuk **Gen Z & Millenial Indonesia**. Tujuannya bukan sekadar menampilkan quotes biasa — melainkan menyediakan kalimat yang **puitis, relate, dan "nggak cringe"** yang siap langsung dipakai sebagai:
- Teks di **IG Notes** (sangat populer di Gen Z)
- **Caption** postingan Instagram
- **Story** WA atau IG
- **Kalimat curhat** yang punya estetika

### Target Pengguna (Persona)
- Usia 16–27 tahun
- Terbiasa dengan estetika TikTok, Pinterest, BeReal, Letterboxd
- Sering *overthinking* malam-malam dan butuh kata-kata yang "ngewakilin perasaan mereka"
- Tidak suka ribet, tapi sangat peduli terhadap estetika visual

---

## TECH STACK & ENVIRONMENT

### Yang WAJIB Digunakan
- **Framework:** React Native (via Expo SDK 54)
- **Router:** `expo-router` (file-based routing di folder `src/app/`)
- **Bahasa:** TypeScript (ketat, jangan gunakan `any`)
- **Styling:** StyleSheet API React Native — JANGAN gunakan library styling pihak ketiga
- **Animasi:** `react-native-reanimated` v4 (sudah terinstal)

### Package yang SUDAH Terinstal (Jangan install ulang)
```
expo-haptics          → Untuk feedback getaran fisik
expo-clipboard        → Untuk fitur salin ke clipboard
@expo-google-fonts/playfair-display → Font utama quotes (serif)
@expo-google-fonts/inter            → Font UI/navigasi (sans-serif)
react-native-reanimated             → Untuk animasi (fade, slide, dll)
expo-splash-screen    → Sudah dikonfigurasi di _layout.tsx
```

### Struktur File Proyek Saat Ini
```
TitikKoma/
├── src/
│   └── app/
│       ├── _layout.tsx      ← Sudah dikonfigurasi (font loading + SplashScreen)
│       └── index.tsx        ← Layar utama (sudah ada MVP awal, perlu dirombak total)
├── data/
│   └── quotes_draft.json    ← Database quotes awal (perlu dikembangkan)
├── briefings/
│   ├── features.md          ← Dokumen fitur lengkap
│   ├── design_system.md     ← Panduan visual & UI/UX
│   └── superprompt.md       ← File ini sendiri
├── app.json                 ← Konfigurasi Expo (jangan ubah sembarangan)
├── package.json
└── tsconfig.json
```

---

## PANDUAN DESAIN UI/UX (WAJIB DIPATUHI KETAT)

### Filosofi Desain: "Raw, Flat & Human"
Ini adalah poin PALING KRITIS. Desain Titik-Koma harus terasa **organik, jujur, dan manusiawi** — seolah dibuat oleh manusia sungguhan, bukan oleh mesin AI.

**DILARANG KERAS (Anti-Patterns):**
- ❌ **Glassmorphism** (efek blur kaca transparan) — ini tanda AI slop
- ❌ **Gradien 3D atau pelangi berkilau** — terlalu "lebay" dan generik
- ❌ **Border radius bulat penuh (pill shape)** pada elemen besar — terasa plastik
- ❌ **Banyak bayangan (drop shadow)** yang dramatis — terasa tidak jujur
- ❌ **Warna neon atau terlalu cerah** pada tema gelap — menyakitkan mata
- ❌ **Animasi yang berlebihan** (bouncing, spin, efek partikel)

**WAJIB DIGUNAKAN (Anti-AI-Slop Principles):**
- ✅ **Flat Design** yang tegas: warna solid, tidak ada kilauan atau transparansi
- ✅ **Neo-Brutalism** untuk elemen interaktif: border tipis `1px` #333/#444, sudut kotak (borderRadius 0 atau sangat kecil), tidak ada shadow
- ✅ **Swiss Design / Editorial**: tata letak berbasis grid yang bersih, typografi kuat sebagai elemen visual utama
- ✅ **Efek noise/grain sangat halus** di background (opsional tapi dianjurkan) sebagai pengganti tekstur yang berlebihan

### Color System (Palette Wajib)
```
Background (Midnight):   #0a0a0a  (bukan pure black, tapi hampir hitam)
Surface/Card:            #111111
Border subtle:           #1e1e1e
Border visible:          #333333
Border emphasized:       #444444
Text primary:            #f0f0f0
Text secondary:          #888888
Text muted:              #444444
Accent (warm white):     #f5f0e8  (digunakan hati-hati, bukan untuk blok besar)
```

### Typography System (WAJIB GUNAKAN FONT YANG SUDAH TERINSTAL)
```
Quotes teks utama:  PlayfairDisplay_400Regular
                    fontSize: 24-32, lineHeight: 1.5x fontSize
                    Karakter: Tegas, sastrawi, tidak pernah italic kecuali nama penulis

Nama penulis:       PlayfairDisplay_400Regular_Italic
                    fontSize: 14-16, color: #888

Semua UI/navigasi:  Inter_500Medium atau Inter_700Bold
                    fontSize: 12-16, letterSpacing: 0.5-2
                    Tombol: UPPERCASE, letterSpacing: 2
```

### Micro-interactions & Animasi
Gunakan `react-native-reanimated` untuk semua animasi. Berikut spesifikasi wajib:

1. **Transisi Quotes (WAJIB):** Saat quote berganti (tombol ditekan atau kategori berubah):
   - Quote lama: `opacity` fade dari `1` → `0`, duration `200ms`
   - Quote baru: `opacity` fade dari `0` → `1`, ditambah `translateY` dari `10` → `0`, duration `300ms`
   - Delay quote baru: `100ms` setelah quote lama selesai fade out

2. **Haptic Feedback (WAJIB):**
   - Ganti kategori: `Haptics.ImpactFeedbackStyle.Light`
   - Tekan tombol "Cari Rasa": `Haptics.ImpactFeedbackStyle.Medium`
   - Berhasil copy ke clipboard: `Haptics.NotificationFeedbackType.Success`

3. **Tombol Press State:** Saat `TouchableOpacity` ditekan, `activeOpacity` harus `0.7`. Jangan gunakan animasi scale/bounce — terasa terlalu "app store generic".

---

## IMPLEMENTASI FITUR (URUTAN PRIORITAS)

### FASE 1 — Core MVP (KERJAKAN INI TERLEBIH DAHULU)

#### 1A. Database Quotes (`data/quotes_draft.json`)
File ini HARUS dirombak total menjadi database yang komprehensif. Berikut skema TypeScript-nya (buat interface ini di file terpisah `src/types/quotes.ts`):

```typescript
export interface Quote {
  id: string;           // UUID atau string unik, misal "q001"
  text: string;         // Teks quotes-nya (BAHASA INDONESIA atau INGGRIS)
  author: string;       // Nama pengarang/sumber, misal "Sapardi Djoko Damono"
  source?: string;      // Judul buku/film jika ada, misal "Hujan Bulan Juni"
  category: 'Sastra' | 'Film' | 'Relatable';
  language: 'id' | 'en';
  length: 'short' | 'medium' | 'long';
                        // short = ≤60 karakter (cocok untuk IG Notes)
                        // medium = 61-150 karakter
                        // long = >150 karakter
  tags: string[];       // Misal: ["malam", "sepi", "galau", "ikhlas"]
}
```

Isi file JSON tersebut dengan MINIMAL **50 quotes** yang terbagi rata:
- 15-20 quotes kategori **Sastra** (Chairil Anwar, Sapardi Djoko Damono, Pramoedya, Rumi terjemahan, dll)
- 15-20 quotes kategori **Film** (dialog atau narasi dari film: 500 Days of Summer, Before Sunrise, Your Name / Kimi no Na wa, La La Land, film Ghibli, dll)
- 15-20 quotes kategori **Relatable** (kalimat yang menggambarkan kondisi sehari-hari Gen Z: capek dewasa, overthinking, ekspektasi sosial, dll)

**PERATURAN KONTEN:**
- Teks harus "deep" tapi tidak lebay atau sok bijak
- Hindari quotes klise yang sudah overused (hindari: "hidup adalah perjalanan", "jangan menyerah", dll)
- Untuk kategori Relatable: boleh berbahasa Indonesia informal/gaul tapi tetap punya estetika
- Pastikan setiap kategori punya setidaknya 5 quotes dengan `length: 'short'` (≤60 karakter) untuk filter IG Notes

#### 1B. Layar Utama (`src/app/index.tsx`) — Rombak Total
Layar utama adalah wajah aplikasi. Strukturnya harus seperti ini (dari atas ke bawah):

```
[StatusBar tersembunyi / light-content]

[HEADER AREA] — marginTop: 56 (safe area)
  Nama aplikasi kecil: "titik—koma" (pakai em-dash, bukan tanda hubung)
  Font: Inter_700Bold, fontSize: 11, letterSpacing: 4, UPPERCASE, color: #444

[FILTER KATEGORI] — horizontal scroll atau chip
  Opsi: Semua | Sastra | Film | Relatable | IG Notes (≤60 karakter)
  Style: Pill dengan border 1px #333, rounded sedikit (borderRadius: 4)
  Saat aktif: backgroundColor: #fff, text: #000

[MAIN CONTENT AREA] — flex: 1, justify: center
  Teks quote: Playfair Display 400 Regular, fontSize: 26-30 (disesuaikan panjang teks)
  Nama penulis: Playfair Display Italic, fontSize: 15, color: #888
  Sumber (jika ada): Inter 400 Regular, fontSize: 12, color: #444
  
  Di bawah penulis, jarak 40px:
  Label kecil: "↑ sentuh untuk menyalin" — Inter 400, fontSize: 11, color: #2a2a2a

[BOTTOM AREA]
  Tombol "CARI RASA" — Neo-Brutalism style
  - width: 100%, height: 56
  - backgroundColor: #000
  - borderWidth: 1, borderColor: #333
  - borderRadius: 0
  - Text: Inter_700Bold, "CARI RASA", fontSize: 13, letterSpacing: 3, UPPERCASE
  - marginBottom: sesuaikan dengan safe area bawah (gunakan useSafeAreaInsets)
```

**Perilaku yang wajib diimplementasikan:**
- Saat layar dimuat pertama kali: tampilkan quote secara acak (bukan selalu index [0])
- Saat kategori berubah: animasikan pergantian quote (lihat spesifikasi animasi di atas)
- Saat tombol "CARI RASA" ditekan: animasikan pergantian quote + haptic medium
- Saat area teks ditekan: salin teks ke clipboard, tampilkan konfirmasi (bukan Alert bawaan — gunakan sebuah View kecil yang muncul sementara dari bawah, dengan teks "Tersalin ✓", lalu otomatis menghilang setelah 2 detik)

**Tentang Konfirmasi Salin:**
JANGAN gunakan `Alert.alert()` — itu terasa murahan dan tidak konsisten dengan estetika. Sebaliknya, buat sebuah komponen **Snackbar** atau **Toast** sederhana yang muncul dari bawah layar selama 2 detik. Implementasikan menggunakan `Animated` atau `Reanimated` (pilih Reanimated untuk konsistensi).

#### 1C. Layout Root (`src/app/_layout.tsx`)
File ini sudah benar strukturnya (memuat font + SplashScreen). Jangan ubah kecuali perlu.

---

### FASE 2 — Fitur Pendukung (Kerjakan Setelah Fase 1 Stabil)

#### 2A. Halaman Bookmark / Koleksi Pribadi
- Route baru: `src/app/saved.tsx`
- Gunakan `AsyncStorage` (install: `@react-native-async-storage/async-storage`) untuk persistensi data lokal
- User bisa menekan ikon bookmark (🔖) di layar utama untuk menyimpan quote
- Halaman saved menampilkan daftar quotes yang disimpan dalam tampilan list sederhana (bukan card bergambar)
- User bisa menghapus dari koleksi dengan swipe-to-delete atau long press

#### 2B. Share as Image
- Tambahkan tombol ikon kecil "bagikan" di dekat teks quote
- Saat ditekan, muncul preview layar sederhana: background hitam pekat + teks di tengah + watermark "titik—koma" kecil di pojok bawah
- Gunakan `react-native-view-shot` (perlu install) untuk mengambil screenshot dari View tersebut
- Bagikan menggunakan `expo-sharing`

#### 2C. Fitur AI "Curhat" (Mood-to-Quote)
- Route baru: `src/app/curhat.tsx`
- Integrasi dengan AI API (Gemini API) — **TUNGGU INSTRUKSI USER DULU mengenai API Key sebelum mengimplementasikan ini**
- UI: Sebuah text input area besar dengan placeholder "cerita dulu, kita cariin kata-katanya..." (lowercase, kasual)
- Tombol kirim
- Output: AI menganalisis teks dan mengembalikan kalimat yang relevan dalam gaya sastra/indie
- Sementara belum ada API Key: buat halaman ini dengan UI-nya saja, dan state "AI sedang disiapkan..." sebagai placeholder

---

## KOMPONEN YANG WAJIB DIBUAT TERPISAH

Jangan taruh semua kode di `index.tsx`. Pisahkan ke file-file komponen:

### `src/components/QuoteDisplay.tsx`
Komponen yang menampilkan teks quote + animasi transisi. Props:
```typescript
interface QuoteDisplayProps {
  quote: Quote;
  onPress: () => void; // Untuk trigger copy
}
```

### `src/components/CategoryFilter.tsx`
Komponen chip/pill filter kategori. Props:
```typescript
interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}
```

### `src/components/Toast.tsx`
Komponen notifikasi kecil yang muncul dari bawah dan auto-dismiss. Props:
```typescript
interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}
```

### `src/hooks/useQuotes.ts`
Custom hook untuk logika filter dan random quote. Return values:
```typescript
{
  currentQuote: Quote;
  activeCategory: string;
  setCategory: (category: string) => void;
  nextQuote: () => void;
}
```

---

## ATURAN KODE (WAJIB DIPATUHI)

1. **TypeScript Strict:** Semua file `.tsx` dan `.ts` harus bebas dari `any`. Gunakan type yang tepat selalu.
2. **Komentar Bahasa Indonesia:** Semua komentar dalam kode ditulis dalam Bahasa Indonesia agar konsisten dengan konteks proyek.
3. **Nama Komponen:** PascalCase. Nama file komponen: PascalCase. Nama file hook: camelCase dengan prefix `use`.
4. **Import Order:** Package eksternal → package Expo → komponen lokal → assets/data. Pisahkan dengan satu baris kosong.
5. **StyleSheet:** Semua style WAJIB menggunakan `StyleSheet.create()`. DILARANG menggunakan inline style (`style={{ ... }}`) kecuali untuk nilai dinamis yang bergantung pada state.
6. **useSafeAreaInsets:** SELALU gunakan ini untuk padding atas dan bawah. Jangan hardcode angka untuk menghindari notch/punch-hole.
7. **Jangan gunakan** `console.log` di kode production. Gunakan hanya saat debugging dan hapus setelahnya.

---

## CHECKLIST SEBELUM MENYELESAIKAN SETIAP FASE

Sebelum melaporkan selesai kepada user, pastikan:

- [ ] Semua TypeScript error hilang (jalankan `npx tsc --noEmit` untuk verifikasi)
- [ ] Tidak ada `console.log` yang tertinggal
- [ ] Animasi pergantian quote sudah berjalan smooth (bukan langsung "pop")
- [ ] Haptic feedback berfungsi pada setiap interaksi yang ditentukan
- [ ] Font kustom (Playfair Display + Inter) sudah terload dan terlihat di HP
- [ ] Fitur copy-to-clipboard berfungsi dan konfirmasi Toast muncul (bukan Alert)
- [ ] Filter kategori berfungsi (termasuk filter "IG Notes" yang hanya tampilkan quote ≤60 karakter)
- [ ] Tidak ada elemen UI yang melanggar aturan Anti-AI-Slop (glassmorphism, gradien, dll)
- [ ] Tampilan sudah dicek di HP sungguhan, bukan hanya di simulator

---

## PESAN AKHIR UNTUK AGEN PELAKSANA

Kamu bukan sekadar memindahkan kode dari dokumen ini ke file. Kamu adalah seorang **pengrajin** (*craftsman*). Setiap detail penting. Jika kamu menemukan cara yang lebih elegan atau efisien untuk mengimplementasikan sesuatu tanpa melanggar panduan ini, lakukanlah.

Ingat bahwa user target aplikasi ini adalah anak muda yang sangat peka terhadap desain. Aplikasi yang tampak seperti dibuat asal-asalan atau seperti template biasa akan langsung ditinggalkan. Setiap piksel harus terasa disengaja.

**Mulailah selalu dari Fase 1.** Setelah Fase 1 diverifikasi dan berjalan mulus di HP nyata, barulah lanjut ke Fase 2.

---
*Dokumen ini ditulis untuk dieksekusi oleh agen AI berkapasitas tinggi. Seluruh keputusan desain dan teknis yang tertulis di sini adalah final kecuali ada instruksi eksplisit dari user untuk mengubahnya.*
