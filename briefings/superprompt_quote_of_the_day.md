# Superprompt: Fitur "Kutipan Hari Ini" — Titik-Koma

## Konteks Proyek
Kita sedang membangun aplikasi mobile **Titik-Koma** menggunakan **React Native + Expo SDK 54** dengan **TypeScript** dan routing **Expo Router** (file-based, direktori `src/app/`). Semua *state* persisten disimpan menggunakan **`@react-native-async-storage/async-storage`** (sudah terinstall). Tidak ada *backend*, tidak ada *API* eksternal untuk fitur ini — semuanya berjalan 100% *offline* di perangkat user.

File-file utama yang relevan:
- `src/app/index.tsx` — halaman utama tempat fitur ini akan ditampilkan
- `src/hooks/useQuotes.ts` — hook yang sudah ada untuk mengelola data quotes
- `src/data/quotes.ts` — file data berisi array semua quote yang ada
- `src/constants/themes.ts` dan `src/context/ThemeContext.tsx` — sistem tema
- Package yang sudah terinstall: `@react-native-async-storage/async-storage`

---

## Tujuan Fitur
Memberikan **alasan bagi user untuk membuka aplikasi setiap hari**. Karena fitur Push Notification ditangguhkan (limitasi Expo Go), kita membutuhkan "kail" berbasis konten di dalam aplikasi itu sendiri. "Kutipan Hari Ini" adalah sebuah banner/kartu khusus yang hanya menampilkan satu quote per hari (berganti setiap jam 00:00 malam) di bagian paling atas halaman Utama — sebuah **ritual harian** yang personal.

---

## Desain Visual & UX

### Posisi di Halaman Utama
Kartu "Kutipan Hari Ini" ditempatkan **di antara label nama aplikasi (TITIK—KOMA) dan area filter kategori** (chip horizontal). Ini membuatnya menjadi elemen pertama yang dilihat user setiap kali membuka aplikasi.

### Anatomi Kartu "Kutipan Hari Ini"
```
┌─────────────────────────────────────────────┐
│  KUTIPAN HARI INI          [ikon kalender] │  ← Header row, tipografi small caps
│                                             │
│  "Mereka yang tidak pernah menangis,        │  ← Teks quote, PlayfairDisplay Italic
│   belum pernah benar-benar melihat."       │     Font size 17, lineHeight 28
│                                             │
│                    — Pramoedya Ananta Toer  │  ← Penulis, Inter Italic, kanan bawah
└─────────────────────────────────────────────┘
  [Tanggal hari ini: Selasa, 12 Agustus]      ← Di bawah kartu, Inter_400Regular, 10sp
```

### Spesifikasi Visual Kartu
- **Background kartu:** Satu shade lebih terang dari `theme.background`. Untuk Midnight: `#111111`. Untuk Kertas Tua: `#e8dfc8`.
- **Border:** Tipis 1px, warna `theme.border`. **Tidak ada** rounded corner yang besar — radius maksimal 0 (Neo-Brutalism).
- **Padding dalam kartu:** 20px semua sisi.
- **Label "KUTIPAN HARI INI":** `Inter_700Bold`, ukuran 9sp, letterSpacing 2, warna `theme.textMuted`. Huruf kapital semua. Diikuti garis pemisah tipis setelahnya (height: 1px, marginVertical: 12px).
- **Teks quote:** `PlayfairDisplay_400Regular_Italic`, ukuran 17sp, lineHeight 28, warna `theme.textPrimary`, dengan pembungkus tanda kutip `"..."`.
- **Teks penulis:** `Inter_400Regular`, ukuran 12sp, warna `theme.textSecondary`, rata kanan (`textAlign: 'right'`), diawali tanda `—`.
- **Ikon kalender:** `Ionicons name="calendar-outline"`, ukuran 14, warna `theme.textMuted`.
- **Teks tanggal di bawah kartu:** `Inter_400Regular`, ukuran 10sp, warna `theme.textMuted`, rata kanan. Format: `"Selasa, 12 Agustus 2025"`.

### Interaksi
- **Sentuh kartu** → Menyalin teks quote ke *clipboard* (sama seperti perilaku di halaman utama) + tampilkan Toast "Tersalin ✓".
- **Sentuh kartu dua kali (double tap)** → Tidak ada aksi khusus (cukup satu aksi untuk menjaga kesederhanaan).
- Kartu **tidak bisa** di-bookmark dari sini (untuk menghindari duplikasi UI). User cukup salin, lalu cari di halaman utama untuk di-bookmark jika perlu.
- Kartu muncul dengan **animasi fade-in** saat pertama kali dimuat (opacity: 0 → 1, durasi 400ms, menggunakan `react-native-reanimated`).

---

## Implementasi Teknis: Hook `useDailyQuote`

Buat file baru: **`src/hooks/useDailyQuote.ts`**

### Logika Inti
Fitur ini sepenuhnya stateless dari sisi *server*. Semua logika berjalan di perangkat:

1. **Seed Deterministik:** Tanggal hari ini (format `YYYY-MM-DD`, contoh `"2025-08-12"`) dijadikan **seed** untuk memilih index quote secara konsisten. Gunakan fungsi *hash string* sederhana untuk mengubah string tanggal menjadi angka, lalu gunakan modulo terhadap jumlah total quotes.
2. **Caching:** Setelah quote hari ini dipilih, simpan ke AsyncStorage dengan key `@titikkoma_daily_quote` bersamaan dengan tanggal hari ini. Besok, saat app dibuka, hook cek apakah tanggal yang tersimpan sama dengan hari ini — jika berbeda, quote baru dihitung dan disimpan.
3. **Immutabilitas:** Quote yang sudah terpilih untuk hari ini tidak akan berubah meskipun user membuka tutup aplikasi berkali-kali.

### Interface
```typescript
interface DailyQuoteState {
  quote: Quote | null;
  isLoading: boolean;
  formattedDate: string; // Contoh: "Selasa, 12 Agustus 2025"
}

function useDailyQuote(): DailyQuoteState
```

### Pseudocode Implementasi
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allQuotes } from '../data/quotes';
import { Quote } from '../types/quotes';

const STORAGE_KEY = '@titikkoma_daily_quote';

// Fungsi hash sederhana — mengubah string tanggal menjadi angka
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Konversi ke 32-bit integer
  }
  return Math.abs(hash);
}

// Dapatkan key tanggal hari ini
function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Format tanggal yang indah untuk tampilan
function formatDate(dateKey: string): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = new Date(dateKey);
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function useDailyQuote(): DailyQuoteState {
  const [state, setState] = useState<DailyQuoteState>({
    quote: null,
    isLoading: true,
    formattedDate: '',
  });

  useEffect(() => {
    const load = async () => {
      const todayKey = getTodayKey();

      // Coba baca dari cache
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.dateKey === todayKey) {
          // Cache valid untuk hari ini
          setState({ quote: parsed.quote, isLoading: false, formattedDate: formatDate(todayKey) });
          return;
        }
      }

      // Cache tidak ada atau kedaluwarsa — hitung quote baru
      const hash = simpleHash(todayKey);
      const index = hash % allQuotes.length;
      const todayQuote = allQuotes[index];

      // Simpan ke cache
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ dateKey: todayKey, quote: todayQuote }));
      setState({ quote: todayQuote, isLoading: false, formattedDate: formatDate(todayKey) });
    };

    load().catch(console.error);
  }, []);

  return state;
}
```

---

## Integrasi ke `src/app/index.tsx`

Tambahkan hook dan komponen kartu di halaman utama:

```tsx
// Di dalam IndexScreen component:
const { quote: dailyQuote, isLoading: isDailyLoading, formattedDate } = useDailyQuote();

// Di JSX, sisipkan di antara nama app dan filter:
{!isDailyLoading && dailyQuote && (
  <DailyQuoteCard
    quote={dailyQuote}
    formattedDate={formattedDate}
    onCopy={handleCopyDaily}
    theme={theme}
  />
)}
```

Buat komponen terpisah **`src/components/DailyQuoteCard.tsx`** untuk menjaga `index.tsx` tetap bersih. Komponen ini menerima `quote`, `formattedDate`, `onCopy`, dan `theme` sebagai props.

---

## Komponen `DailyQuoteCard.tsx`

### State Internal
- `copyFlash: boolean` — saat berubah jadi `true`, jalankan animasi "kilat" tipis (opacity border sedikit naik lalu turun kembali, durasi total 400ms) untuk memberikan umpan balik visual bahwa copy berhasil, selain Toast.

### Animasi Kemunculan
Gunakan `useSharedValue(0)` untuk `opacity` kartu. Jalankan `withTiming(1, { duration: 400 })` di dalam `useEffect(() => {}, [])` agar kartu fade-in secara elegan saat pertama kali muncul.

### Aksesibilitas
- Beri prop `accessibilityLabel={`Kutipan hari ini: ${quote.text}, oleh ${quote.author}`}` pada elemen Pressable.
- Beri `accessibilityHint="Ketuk untuk menyalin teks"`.

---

## Hal-Hal yang DILARANG (Anti-AI-Slop)
- ❌ TIDAK BOLEH menggunakan API eksternal, *backend*, atau *database* untuk menentukan quote hari ini. Semua murni *offline* dan deterministik.
- ❌ TIDAK BOLEH menampilkan lebih dari satu quote di kartu ini.
- ❌ TIDAK BOLEH ada tombol "Refresh" atau "Ganti Quote" pada kartu ini — ia hanya berganti keesokan hari.
- ❌ TIDAK BOLEH ada shadow besar, rounded corner besar, atau efek warna gradien pada kartu.
- ❌ TIDAK BOLEH menampilkan kartu ini saat data sedang dimuat (gunakan `isDailyLoading` untuk merender kartu hanya setelah data siap, jangan render skeleton/placeholder yang kompleks).
- ❌ TIDAK BOLEH mengubah layout atau komponen lain di `index.tsx` selain menyisipkan kartu di posisi yang benar.
- ❌ TIDAK BOLEH menggunakan library kalender atau date eksternal. Cukup gunakan `new Date()` dari JavaScript bawaan.

---

## Skenario Pengujian

Setelah implementasi selesai, lakukan pengujian berikut:
1. **Buka app** → Kartu "Kutipan Hari Ini" muncul dengan animasi fade-in. Quote dan tanggal terlihat dengan jelas.
2. **Tutup dan buka ulang app** → Quote yang sama masih muncul (tidak berubah).
3. **Ganti tema** (dari Midnight ke Kertas Tua) → Warna kartu berubah mengikuti tema baru.
4. **Sentuh kartu** → Toast "Tersalin ✓" muncul di bagian bawah layar.
5. **Simulasi hari berikutnya** (ubah sementara fungsi `getTodayKey` untuk mengembalikan tanggal besok) → Quote berubah menjadi quote yang berbeda.

---

## Hasil Akhir yang Diharapkan
Setiap kali user membuka aplikasi Titik-Koma, hal pertama yang mereka lihat (selain nama aplikasi) adalah satu kalimat yang dipilih khusus untuk mereka hari ini — **sebuah ritual harian yang subtil tapi kuat secara psikologis**. Ini menciptakan kebiasaan membuka aplikasi tanpa terasa dipaksa, karena user selalu penasaran: *"Quote apa yang muncul hari ini?"*
