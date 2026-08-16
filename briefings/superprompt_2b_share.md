# SUPERPROMPT: Fitur 2B — "Share as Image" untuk Aplikasi Titik-Koma

---

## KONTEKS & TUJUAN FITUR

Fitur ini adalah salah satu fitur paling krusial dari seluruh aplikasi Titik-Koma. Target pengguna (Gen Z) bukan hanya ingin *membaca* quotes — mereka ingin **mempostingnya ke media sosial dengan estetika yang sudah jadi**. Tanpa ribet buka Canva, tanpa susah payah edit template.

Fitur "Share as Image" memungkinkan user untuk:
1. Melihat **pratinjau (*preview*)** dari quote yang sedang ditampilkan di layar utama, dikemas dalam sebuah "kanvas" visual yang estetis.
2. Memilih **gaya visual (*style*)** kanvas yang berbeda-beda sesuai *vibe* mereka.
3. Langsung **mengekspor gambar** tersebut ke galeri HP atau berbagi langsung ke aplikasi lain (WhatsApp, Instagram, dll).

---

## TECH STACK & PACKAGE YANG DIGUNAKAN

### Package Baru yang HARUS Diinstal Sebelum Mulai Coding:
```bash
npx expo install react-native-view-shot expo-media-library expo-sharing
```

- **`react-native-view-shot`**: Mengambil *screenshot* dari sebuah React Native `View` dan menghasilkan file gambar. Ini adalah inti dari fitur ini.
- **`expo-media-library`**: Untuk menyimpan gambar hasil ekspor langsung ke galeri foto HP user.
- **`expo-sharing`**: Untuk membuka *share sheet* native HP sehingga user bisa langsung kirim ke WhatsApp, Instagram, dll.

### Package yang SUDAH Terinstal (Jangan Install Ulang):
- `expo-haptics`
- `expo-router`
- `react-native-reanimated`
- `react-native-safe-area-context`
- `@expo-google-fonts/playfair-display`
- `@expo-google-fonts/inter`

---

## ARSITEKTUR FITUR (File yang Harus Dibuat/Dimodifikasi)

### File Baru yang Harus Dibuat:
```
src/
├── app/
│   └── share.tsx                  ← [BARU] Halaman pratinjau & ekspor gambar
├── components/
│   └── QuoteCanvas.tsx            ← [BARU] Komponen "kanvas" yang dirender jadi gambar
└── hooks/
    └── useShareImage.ts           ← [BARU] Hook yang mengelola logika capture & share
```

### File yang Harus Dimodifikasi:
```
src/app/index.tsx                  ← Tambahkan tombol "Bagikan" di layar utama
src/app/_layout.tsx                ← Daftarkan route 'share'
```

---

## SPESIFIKASI UI/UX DETAIL

### Cara User Mengakses Fitur Ini (Flow)

```
[Layar Utama]
      ↓
 User menekan tombol "BAGIKAN" (ikon berbagi, di sebelah tombol bookmark)
      ↓
[Halaman Share — src/app/share.tsx]
  - Muncul dengan animasi slide dari bawah (seperti modal/bottom sheet)
  - Menampilkan pratinjau kanvas gambar di bagian atas (75% layar)
  - Menampilkan pilihan gaya di bawah (horizontal scroll)
  - Menampilkan dua tombol aksi di paling bawah
      ↓
 User memilih gaya → pratinjau langsung berubah
      ↓
 User menekan "SIMPAN KE GALERI" atau "BAGIKAN LANGSUNG"
```

### Komponen `QuoteCanvas.tsx` — Spesifikasi Sangat Detail

Ini adalah **View yang akan diubah jadi gambar**, sehingga harus dirender dengan sempurna. Ukuran kanvas wajib menggunakan rasio **1:1 (persegi)** atau **4:5** untuk kompatibilitas Instagram. Aku rekomendasikan **1080x1080** piksel (tapi di React Native, kita pakai dimensi `width: 320, height: 320` lalu scale saat ekspor).

#### Gaya Kanvas yang HARUS Diimplementasikan (Minimal 3 Gaya)

**Gaya 1: "Midnight" (Default)**
- `backgroundColor`: `#0a0a0a` (hitam pekat)
- Teks quote: `#f0f0f0`, font Playfair Display Regular
- Nama penulis: `#888`, font Playfair Display Italic
- Border tipis di dalam kanvas: `1px solid #1e1e1e` dengan padding 24px dari tepi
- Watermark: teks kecil `titik—koma` di pojok kanan bawah, warna `#2a2a2a`
- Efek: Tidak ada efek khusus — *flat* dan bersih

**Gaya 2: "Kertas Tua"**
- `backgroundColor`: `#f5f0e8` (krem/kertas tua)
- Teks quote: `#1a1a1a`, font Playfair Display Regular
- Nama penulis: `#666`, font Playfair Display Italic
- Border: `1px solid #d4c9b0` dengan padding 24px
- Watermark: `titik—koma`, warna `#c4b89a`
- Efek: Tidak ada blur/transparansi — tetap flat

**Gaya 3: "Malam Hujan" (Dark Warm)**
- `backgroundColor`: `#0f0d0b` (hitam kecoklatan hangat)
- Teks quote: `#e8e0d0`, font Playfair Display Regular
- Nama penulis: `#7a7068`, font Playfair Display Italic
- Aksen garis horizontal tipis di atas dan bawah teks: `1px solid #2a2520`
- Watermark: `titik—koma`, warna `#2a2520`

> [!IMPORTANT]
> **DILARANG** menambahkan efek gradien, blur, bayangan tebal, atau tekstur gambar apapun pada kanvas. Semua gaya harus **flat** dan clean. Tekstur grain/noise yang halus BOLEH digunakan HANYA jika diimplementasikan sebagai pola SVG kecil (bukan overlay gambar), dan hanya jika bisa dilakukan tanpa library tambahan.

#### Elemen di Dalam Kanvas (Dari Atas ke Bawah):
```
┌─────────────────────────────┐
│  [Border tipis dalam]       │
│                             │
│                             │
│   "teks quote di sini       │
│    dengan font Playfair      │
│    Display, multi-line"     │
│                             │
│          — Nama Penulis     │
│            Judul Sumber     │
│                             │
│                             │
│               titik—koma    │  ← watermark kecil, pojok kanan bawah
└─────────────────────────────┘
```

**Aturan Ukuran Font di Kanvas (Sangat Penting):**
Font size harus **dinamis** berdasarkan panjang teks quote:
- Teks ≤60 karakter: `fontSize: 28`
- Teks 61–120 karakter: `fontSize: 22`
- Teks 121–200 karakter: `fontSize: 18`
- Teks >200 karakter: `fontSize: 15`

Fungsi helper untuk ini:
```typescript
const getFontSize = (text: string): number => {
  if (text.length <= 60) return 28;
  if (text.length <= 120) return 22;
  if (text.length <= 200) return 18;
  return 15;
};
```

### Halaman `share.tsx` — Layout Lengkap

```
[StatusBar: light-content]

[HEADER] — paddingTop: safeArea.top + 16
  Tombol "✕" (tutup) di kiri — kembali ke layar utama
  Teks "PRATINJAU" di tengah — Inter Bold, 11px, letterSpacing 4
  [Spacer] di kanan

[PRATINJAU KANVAS] — ditampilkan di tengah atas
  - Kanvas `QuoteCanvas` di dalam ScrollView atau View biasa
  - Diberi padding horizontal 32px agar ada "breathing room"
  - Rasio 1:1 (width = height = Dimensions.get('window').width - 64)
  - Diberi border 1px #1e1e1e sebagai "bingkai display"

[PILIHAN GAYA] — horizontal scrollable
  - Judul "PILIH GAYA" — Inter Bold, 9px, letterSpacing 2, color #444, margin bawah 12px
  - Tiga thumbnail kecil (rasio 1:1, ukuran 72x72)
  - Setiap thumbnail adalah versi mini dari QuoteCanvas (tanpa teks panjang, cuma preview warna)
  - Thumbnail aktif: diberi border 1px #f0f0f0
  - Thumbnail tidak aktif: border 1px #222

[TOMBOL AKSI] — di bagian paling bawah
  Dua tombol bersebelahan:
  - "SIMPAN" (kiri) — flat, border 1px #333, backgroundColor #000
  - "BAGIKAN" (kanan) — flat, backgroundColor #f0f0f0, teks #000
  marginBottom: safeArea.bottom + 24
```

---

## IMPLEMENTASI LOGIKA (`useShareImage.ts`)

Hook ini harus mengekspos fungsi dan state berikut:

```typescript
interface UseShareImageReturn {
  // Ref yang dipasang ke komponen QuoteCanvas untuk di-capture
  canvasRef: React.RefObject<ViewShot>;
  
  // Status loading saat sedang proses capture/save/share
  isProcessing: boolean;
  
  // Fungsi: simpan ke galeri foto HP
  saveToGallery: () => Promise<void>;
  
  // Fungsi: buka share sheet native
  shareImage: () => Promise<void>;
}
```

**Alur Logika `saveToGallery`:**
1. Minta izin akses media library: `MediaLibrary.requestPermissionsAsync()`
2. Jika izin ditolak → tampilkan Toast "Akses galeri diperlukan"
3. Jika izin diberikan → capture kanvas: `canvasRef.current?.capture()`
4. Simpan ke galeri: `MediaLibrary.saveToLibraryAsync(uri)`
5. Tampilkan Toast "Tersimpan ke galeri ✓"
6. Haptic: `Haptics.notificationAsync(Success)`

**Alur Logika `shareImage`:**
1. Capture kanvas: `canvasRef.current?.capture()`
2. Buka share sheet: `Sharing.shareAsync(uri)`
3. Haptic: `Haptics.impactAsync(Medium)`

**Opsi Capture yang Wajib Diatur:**
```typescript
const captureOptions = {
  format: 'png',
  quality: 1.0,
  result: 'tmpfile', // Simpan ke file sementara
};
```

---

## INTEGRASI KE LAYAR UTAMA (`index.tsx`)

Di `index.tsx`, tambahkan sebuah tombol "BAGIKAN" di samping tombol bookmark yang sudah ada.

**Layout `bottomBar` yang diperbarui:**
```
[★ Bookmark] [    CARI RASA    ] [↑ Bagikan]
```

Tombol "BAGIKAN":
- Ukuran sama dengan tombol Bookmark (44x44)
- Ikon: teks `↑` atau `⬆` — Inter Bold, 18px
- Border 1px #333, sudut 0 (Neo-Brutalism)
- Saat ditekan: navigasi ke `router.push('/share')` dengan membawa data quote saat ini

**Cara Membawa Data Quote ke Halaman Share:**
Gunakan `expo-router` params:
```typescript
router.push({
  pathname: '/share',
  params: { quoteId: currentQuote.id }
});
```
Di `share.tsx`, baca params tersebut dan cari quote dari database JSON berdasarkan ID-nya.

---

## ATURAN KODE WAJIB (SAMA SEPERTI SUPERPROMPT UTAMA)

1. **TypeScript Strict**: Tidak ada `any`. Semua props dan return values harus punya type.
2. **Komentar Bahasa Indonesia**: Semua komentar dalam kode.
3. **StyleSheet.create()**: Tidak ada inline style kecuali nilai dinamis.
4. **useSafeAreaInsets**: Gunakan selalu untuk padding atas/bawah.
5. **Tidak ada `console.log`** di kode final.
6. **Tidak ada glassmorphism / gradien / shadow dramatis** — seluruh desain harus flat.

---

## IZIN YANG DIBUTUHKAN (Konfigurasi `app.json`)

Tambahkan konfigurasi izin berikut ke `app.json` di dalam objek `expo.android` dan `expo.ios`:

```json
{
  "expo": {
    "android": {
      "permissions": ["READ_MEDIA_IMAGES", "WRITE_EXTERNAL_STORAGE"]
    },
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryAddUsageDescription": "Titik-Koma perlu akses galeri untuk menyimpan gambar quotes."
      }
    }
  }
}
```

---

## CHECKLIST SEBELUM DINYATAKAN SELESAI

- [ ] Jalankan `npx tsc --noEmit` — harus **0 error**
- [ ] Tombol bagikan muncul di layar utama (kanan bawah, sejajar dengan bookmark)
- [ ] Halaman Share terbuka saat tombol ditekan
- [ ] Pratinjau kanvas tampil dengan benar (teks tidak terpotong, font kustom terload)
- [ ] Tiga pilihan gaya bisa dipilih dan pratinjau langsung berubah
- [ ] Tombol "SIMPAN" berhasil menyimpan gambar ke galeri HP
- [ ] Tombol "BAGIKAN" berhasil membuka share sheet native HP
- [ ] Izin galeri diminta dengan pesan yang wajar saat pertama kali digunakan
- [ ] Haptic feedback berjalan di setiap interaksi
- [ ] Tidak ada elemen visual yang melanggar aturan Anti-AI-Slop

---

## CATATAN KRITIKAL UNTUK AGEN PELAKSANA

> [!WARNING]
> `react-native-view-shot` memerlukan perhatian khusus. Pastikan `ViewShot` membungkus (`wraps`) tepat komponen `QuoteCanvas` yang ingin di-capture — **bukan seluruh layar**. Jika salah membungkus, gambar yang dihasilkan akan menangkap elemen UI lain yang tidak diinginkan (tombol, header, dll).

> [!WARNING]
> Font kustom (Playfair Display) mungkin **tidak muncul** dalam gambar hasil capture di beberapa device jika komponen `QuoteCanvas` tidak sempat melakukan full render sebelum di-capture. Tambahkan delay kecil (`await new Promise(r => setTimeout(r, 100))`) sebelum memanggil `capture()` untuk memastikan font sudah terrender dengan sempurna.

> [!IMPORTANT]
> Ukuran kanvas dalam kode React Native (`width: 320, height: 320`) berbeda dengan ukuran gambar yang dihasilkan. `react-native-view-shot` akan menghasilkan gambar sesuai DPI layar HP. Di HP 3x DPI, gambar yang dihasilkan akan berukuran `960x960` piksel — sudah cukup tajam untuk diposting di Instagram.

---
*Superprompt ini ditulis sebagai panduan eksekusi untuk fitur 2B: Share as Image pada aplikasi Titik-Koma. Kerjakan secara berurutan dari instalasi package → pembuatan hook → komponen kanvas → halaman share → integrasi ke layar utama.*
