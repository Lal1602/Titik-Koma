# Superprompt: Fitur "Share as Image" — Titik-Koma

## Konteks Proyek
Kita sedang membangun aplikasi mobile **Titik-Koma** menggunakan **React Native + Expo SDK 54** dengan routing berbasis **Expo Router** (file-based routing di direktori `src/app/`). Bahasa yang digunakan adalah **TypeScript**. Desain sistem mengikuti panduan **Anti-AI-Slop**: flat/Neo-Brutalism, tipografi serif (Playfair Display) + sans-serif (Inter), palet warna gelap syahdu (Midnight), tanpa gradien murahan, tanpa rounded corner berlebihan.

Konteks teknis:
- File routing ada di `src/app/`
- Komponen reusable di `src/components/`
- Hooks di `src/hooks/`
- Tema dan token warna di `src/constants/themes.ts` dan `src/context/ThemeContext.tsx`
- Tipe data Quote ada di `src/types/quotes.ts`
- Sudah ada package `expo-media-library` (untuk simpan ke galeri) dan `expo-file-system`
- Sudah ada navigasi ke `share.tsx` dari halaman utama via `router.push({ pathname: '/share', params: { quoteId: currentQuote.id } })`
- Belum ada implementasi apapun di `src/app/share.tsx` selain kerangka kosong

---

## Tujuan Fitur
Mengubah teks *quotes* menjadi sebuah **gambar kanvas statis berbentuk portrait (rasio 9:16)** yang bisa langsung disimpan ke galeri dan dibagikan ke Instagram Story, WhatsApp Status, X (Twitter), dll. — **tanpa user perlu buka Canva atau aplikasi edit foto**. Ini adalah fitur paling viral dan menjadi pembeda utama Titik-Koma dari aplikasi quotes biasa.

---

## Desain Visual Kanvas

### Pilihan Rasio Kanvas (Aspect Ratio)
User dapat memilih rasio kanvas sesuai kebutuhan platform sosial media mereka. Pemilih rasio (opsi teks atau ikon) diletakkan di atas pemilih tema.
1. **9:16 (IG Story/TikTok):** 1080 x 1920 piksel.
2. **1:1 (IG Feed/Square):** 1080 x 1080 piksel.
3. **4:3 (Standard Photo):** 1080 x 1440 piksel (portrait feed).
4. **16:9 (Landscape/X/Twitter):** 1920 x 1080 piksel.

Di dalam aplikasi, kanvas di-preview dalam kontainer yang secara dinamis menyesuaikan proporsi rasionya (misal untuk 9:16 memakai skala 1/5 dari ukuran asli) agar pas dilihat di layar HP.

### Pilihan Tema Background (3 Opsi)
User dapat memilih satu dari tiga tema background untuk kanvasnya. Semua tema mengikuti estetika *dark-academia*:

#### 1. Tema: "Hitam Pekat" (`midnight_solid`)
- Background: Solid `#0a0a0a`
- Teks quote: `#f0f0f0`
- Teks penulis: `#555555`
- Aksen garis dekoratif: `#222222`
- Tidak ada tekstur, sangat bersih dan minimalis.

#### 2. Tema: "Kertas Tua" (`vintage_paper`)
- Background: Krem kusam `#f0ead6`
- Teks quote: `#1a1a1a`
- Teks penulis: `#7a6a52`
- Aksen garis dekoratif: `#c8b89a`
- Tidak ada foto atau tekstur noise (terlalu berat di-render di RN).

#### 3. Tema: "Abu Dingin" (`cold_grey`)
- Background: Abu kebiruan gelap `#1a1d24`
- Teks quote: `#e8eaf0`
- Teks penulis: `#5a6070`
- Aksen garis dekoratif: `#2a2d38`
- Memberikan vibe sendu, seperti langit mendung.

#### 4. Tema: "Malam Berbintang" (`starry_night`)
- Background: Biru malam sangat gelap `#0b1021`
- Teks quote: `#e8f1f2`
- Teks penulis: `#748296`
- Aksen garis dekoratif: `#1c253d`
- Sangat cocok untuk *quotes* tentang overthinking malam hari.

#### 5. Tema: "Kopi Hitam" (`black_coffee`)
- Background: Coklat pekat sangat gelap `#1c1311`
- Teks quote: `#e5d9c5`
- Teks penulis: `#8c7b6d`
- Aksen garis dekoratif: `#362723`
- Estetika warkop indie, kalem dan membumi.

### Tata Letak Elemen dalam Kanvas (dari atas ke bawah)
```
[Padding atas 60px]
[Garis dekoratif horizontal tipis, lebar 40px, tebal 1px, di tengah]
[Spacer 40px]
[Teks Quote — font PlayfairDisplay_400Regular, ~28-32sp, center, lebar 80% kanvas, italic]
[Spacer 28px]
[Teks Penulis — font PlayfairDisplay_400Regular_Italic, ~15sp, center, "— {author}"]
[Jika ada source: Teks Source — Inter_400Regular, ~11sp, center]
[Spacer fleksibel — mendorong watermark ke bawah]
[Garis dekoratif horizontal tipis, lebar 40px, tebal 1px, di tengah]
[Spacer 20px]
[Watermark "TITIK—KOMA" — Inter_700Bold, ~9sp, letterSpacing 4, textAlign center, warna sangat redup]
[Padding bawah 60px]
```

---

## Implementasi Teknis

### Library yang Digunakan
- **`react-native-view-shot`**: Untuk "memotret" (screenshot) View/komponen menjadi file gambar. Ini adalah library utama fitur ini. **Harus diinstall:** `npx expo install react-native-view-shot`
- **`expo-media-library`**: Sudah terinstall. Digunakan untuk menyimpan file gambar ke galeri HP.
- **`expo-sharing`**: Sudah terinstall. Digunakan untuk membuka dialog share native OS.

### Alur Kerja Teknis
1. User membuka halaman `share.tsx`, menerima `quoteId` dari params navigasi.
2. Halaman mencari data quote lengkap (teks, penulis, source) dari data quotes berdasarkan `quoteId`.
3. Di layar, ditampilkan **preview kanvas** (skala kecil, ~1/5 ukuran) dalam sebuah komponen `View` yang diberi `ref`.
4. Di bawah preview, terdapat pemilih tema (3 opsi chip) dan dua tombol aksi.
5. Saat user menekan **"SIMPAN KE GALERI"**:
   a. Panggil `viewShotRef.current.capture()` — ini akan me-render View full resolution dan mengembalikan URI file sementara.
   b. Minta izin galeri via `MediaLibrary.requestPermissionsAsync()`.
   c. Simpan ke galeri via `MediaLibrary.saveToLibraryAsync(uri)`.
   d. Tampilkan Toast sukses "Tersimpan ke Galeri ✓".
6. Saat user menekan **"BAGIKAN"**:
   a. Capture view sama seperti langkah 5a.
   b. Panggil `Sharing.shareAsync(uri)` — ini membuka dialog share native (Instagram, WhatsApp, dll).

### Implementasi ViewShot
```tsx
import ViewShot, { CaptureOptions } from 'react-native-view-shot';

const viewShotRef = useRef<ViewShot>(null);

const captureOptions: CaptureOptions = {
  format: 'jpg',
  quality: 0.95,
  width: 1080,  // Output resolusi penuh
  height: 1920,
};

const handleCapture = async () => {
  const uri = await viewShotRef.current?.capture?.();
  if (!uri) throw new Error('Gagal mengambil gambar');
  return uri;
};
```

### Struktur Komponen Preview Kanvas
```tsx
// Komponen <ShareCanvas> — bisa di file terpisah src/components/ShareCanvas.tsx
interface ShareCanvasProps {
  quote: Quote;
  theme: 'midnight_solid' | 'vintage_paper' | 'cold_grey';
  isPreview?: boolean; // Jika true, render dengan skala kecil untuk di layar
}
```

---

## Halaman `src/app/share.tsx` — Tata Letak Layar

### Header
- Tombol `←` (Ionicons `arrow-back`) di kiri atas untuk kembali ke halaman sebelumnya.
- Teks "BAGIKAN" di tengah — Inter_700Bold, letterSpacing 4, `textGhost`.

### Area Preview
- Kontainer tengah dengan bayangan samar (shadow tipis) menampilkan `<ShareCanvas>` versi kecil.
- Di bawah preview, terdapat keterangan kecil "Ketuk tema untuk mengubah tampilan".

### Pemilih Rasio & Tema
- **Pemilih Rasio (4 Opsi):** Baris tombol tipis (tab) di atas kanvas: `9:16` | `1:1` | `4:3` | `16:9`.
- **Pemilih Tema (5 Chip):**
  - Lima chip horizontal (scrollable jika layar kecil): ⬛ Hitam | 📜 Kertas | 🌫️ Abu | 🌌 Malam | ☕ Kopi
  - Chip yang aktif diberi border putih/terang, yang tidak aktif border redup.
- Menggunakan state `selectedRatio` dan `selectedTheme` untuk mengontrol tampilan kanvas secara *real-time*.

### Area Tombol Aksi
- Dua tombol sejajar: **"SIMPAN KE GALERI"** (outline, lebar penuh) dan **"BAGIKAN"** (filled, lebar penuh).
- Tinggi tombol: 56px. Border-radius: 0 (Neo-Brutalism). Tidak ada shadow.

### State Loading
- Saat proses capture & save sedang berjalan, tombol menampilkan `<ActivityIndicator>` dan teks berubah menjadi "menyimpan...".
- User tidak bisa menekan tombol dua kali (disabled saat loading).

---

## Hal-Hal yang DILARANG (Anti-AI-Slop)
- ❌ TIDAK BOLEH menggunakan `LinearGradient` di kanvas.
- ❌ TIDAK BOLEH ada emoji di dalam kanvas output.
- ❌ TIDAK BOLEH ada rounded corner pada elemen dekoratif di kanvas.
- ❌ TIDAK BOLEH menggunakan warna selain yang sudah dispesifikasikan di atas.
- ❌ TIDAK BOLEH ada teks motivasi generik di UI (seperti "Sebarkan inspirasi!").
- ❌ TIDAK BOLEH ada icon selain Ionicons yang sudah dipakai di proyek ini.
- ❌ TIDAK BOLEH menyarankan penggunaan Canva atau library pihak ketiga selain `react-native-view-shot`.

---

## Hasil Akhir yang Diharapkan
Ketika selesai, user dapat:
1. Membuka halaman Share dari halaman Utama.
2. Melihat preview *quote* mereka di atas kanvas yang elegan.
3. Memilih salah satu dari 3 tema estetik.
4. Menyimpan gambar HD (1080x1920) ke galeri HP mereka.
5. Langsung membagikan gambar tersebut ke Instagram Story, WhatsApp, atau platform lainnya.

Seluruh antarmuka (UI/UX) harus mengikuti **Design System Titik-Koma**: gelap, minimalis, Neo-Brutalis, tanpa efek murahan.
