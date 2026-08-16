# SUPERPROMPT: Fitur 2C — AI Curhat + Bottom Navigation Bar

---

## GAMBARAN BESAR PERUBAHAN INI

Ini adalah perubahan **paling struktural** sejauh ini. Kita tidak hanya menambahkan fitur AI, tapi juga **merombak arsitektur navigasi** dari sebuah single-screen menjadi aplikasi dengan **bottom navigation bar** bergaya Instagram (3 tab).

Setelah fitur ini selesai, aplikasi akan punya struktur seperti ini:

```
┌──────────────────────────────────┐
│                                  │
│   [Konten halaman aktif]         │
│                                  │
├──────────────────────────────────┤
│   🤖 Curhat   🏠 Utama   ☰ Lainnya │  ← Bottom Nav Bar
└──────────────────────────────────┘
```

**Urutan tab (kiri ke kanan):**
1. **Curhat (AI)** — halaman baru untuk fitur Mood-to-Quote
2. **Utama (Home)** — halaman quote randomizer yang sudah ada (`index.tsx`)
3. **Lainnya** — halaman gabungan Koleksi/Bookmark + Pengaturan

---

## ARSITEKTUR NAVIGASI BARU

### Struktur File yang Harus Dibuat/Dimodifikasi:

```
src/
├── app/
│   ├── _layout.tsx          ← [MODIFIKASI BESAR] Tambahkan custom bottom tab navigator
│   ├── index.tsx            ← [MODIFIKASI] Bersihkan navigasi lama, sesuaikan dengan tab
│   ├── saved.tsx            ← [HAPUS/MERGE] Kontennya dipindah ke more.tsx
│   ├── curhat.tsx           ← [BUAT BARU] Halaman AI Curhat
│   └── more.tsx             ← [BUAT BARU] Halaman gabungan Koleksi + Pengaturan
├── components/
│   ├── BottomNav.tsx        ← [BUAT BARU] Komponen bottom navigation bar kustom
│   └── ... (komponen lain tidak perlu diubah)
```

> [!IMPORTANT]
> Gunakan **custom `BottomNav` component** yang dibungkus di dalam root `_layout.tsx` — JANGAN gunakan `expo-router` tabs atau React Navigation `TabNavigator`. Kenapa? Karena fitur share (`/share`) harus tetap bisa muncul sebagai layar penuh (modal) di atas semua tab tanpa menampilkan bottom nav. Dengan custom component, kita punya kontrol penuh.

### Cara Kerja Navigasi Baru:

```
_layout.tsx (Stack Navigator — sama seperti sekarang)
├── index           → Tab "Utama" 
├── curhat          → Tab "Curhat"
├── more            → Tab "Lainnya"
└── share           → Layar penuh (tidak ada bottom nav)
```

`BottomNav` dirender sebagai overlay di dalam setiap layar tab (index, curhat, more). Layar `share` tidak merender `BottomNav`.

---

## SPESIFIKASI BOTTOM NAV BAR — DETAIL PENUH

### Desain Visual (Wajib Anti-AI-Slop):
- **Background:** `#0a0a0a` — sama dengan background aplikasi, tidak ada elevasi atau bayangan
- **Border atas:** `1px solid #1e1e1e` — garis tipis yang memisahkan konten dari nav
- **Tinggi:** `56px` + `safeAreaInsets.bottom` (agar tidak tertutup gesture bar Android)
- **TIDAK ADA:** rounded corners, blur, glassmorphism, bayangan, atau background berbeda

### Desain Ikon (Wajib Gunakan GoogleFont atau AwesomeIcon atau Teks Unicode):
Gunakan salah satu dari opsi berikut (pilih yang paling ringan dan kompatibel dengan Expo SDK 54): **`@expo/vector-icons`** (sudah termasuk dalam Expo, tidak perlu install tambahan — direkomendasikan), atau **karakter Unicode** sebagai fallback jika ikon tidak tersedia. Jangan install library ikon pihak ketiga yang besar hanya untuk 3 ikon navigasi.

| Tab | Ikon Tidak Aktif | Ikon Aktif |
|---|---|---|
| Curhat (AI) | `✦` (warna `#444`) | `✦` (warna `#f0f0f0`) |
| Utama | `◈` (warna `#444`) | `◈` (warna `#f0f0f0`) |
| Lainnya | `≡` (warna `#444`) | `≡` (warna `#f0f0f0`) |

**Label di bawah ikon:**
- Font: `Inter_400Regular`, fontSize: `10`, letterSpacing: `0.5`
- Warna tidak aktif: `#444`
- Warna aktif: `#f0f0f0`
- Label: "Curhat", "Utama", "Lainnya"

**Animasi Tab Press:**
- Tidak ada skala besar atau bounce — cukup opacity dari `0.5` ke `1.0` dengan `withTiming(150ms)` menggunakan Reanimated
- Haptic: `Haptics.ImpactFeedbackStyle.Light` setiap kali tab ditekan

### Interface Props `BottomNav`:
```typescript
interface BottomNavProps {
  activeTab: 'curhat' | 'index' | 'more';
  onTabPress: (tab: 'curhat' | 'index' | 'more') => void;
}
```

### Cara Penggunaan di Setiap Layar Tab:
```tsx
// Di bagian bawah JSX setiap halaman tab (index.tsx, curhat.tsx, more.tsx)
<BottomNav
  activeTab="index" // atau "curhat" atau "more"
  onTabPress={(tab) => router.replace(`/${tab === 'index' ? '' : tab}`)}
/>
```

> [!IMPORTANT]
> Gunakan `router.replace()` (bukan `router.push()`) untuk navigasi antar tab agar tidak menumpuk history navigasi — ini mencegah tombol back Android membawa user ke tab sebelumnya (perilaku yang tidak diinginkan pada bottom nav).

---

## FITUR 2C: HALAMAN CURHAT AI (`curhat.tsx`)

### Konsep Fitur:
User mengetikkan perasaannya secara natural ("lagi capek sama ekspektasi keluarga", "hujan-hujan kangen mantan tapi gengsi"), dan aplikasi menganalisis mood tersebut lalu mengembalikan kalimat yang relate, puitis, dan estetis.

### Integrasi AI: Gemini API
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY`
- **Method:** POST, body JSON
- **API Key:** **JANGAN hardcode di kode.** Buat file `.env` di root project:
  ```
  EXPO_PUBLIC_GEMINI_API_KEY=isi_api_key_disini
  ```
  Akses di kode: `process.env.EXPO_PUBLIC_GEMINI_API_KEY`
- **Catatan:** File `.env` harus sudah ada di `.gitignore` — pastikan sebelum commit!

### System Prompt yang Harus Dikirim ke Gemini:
```
Kamu adalah penyair digital bernama "Titik-Koma". Tugasmu adalah mengubah perasaan yang diceritakan user menjadi satu kalimat yang puitis, estetis, dan relate — dalam gaya sastra Indonesia modern atau bahasa Inggris yang elegan.

Aturan ketat:
1. Output HANYA berupa satu kalimat quotes (bukan paragraf, bukan penjelasan, bukan intro)
2. Panjang maksimal 200 karakter
3. Gaya bahasa: sastrawi tapi tidak lebay, seperti Sapardi atau Rumi versi modern
4. Boleh menggunakan metafora alam, waktu, atau benda sehari-hari
5. TIDAK BOLEH menggunakan kata-kata klise seperti: "jangan menyerah", "kamu kuat", "semangat ya"
6. Tidak perlu menyebut nama penulis atau sumber — cukup kalimatnya saja

Input dari user:
```

### Request Body ke Gemini API:
```json
{
  "contents": [{
    "parts": [{
      "text": "[system_prompt]\n\n[teks_curhat_user]"
    }]
  }],
  "generationConfig": {
    "maxOutputTokens": 100,
    "temperature": 0.9
  }
}
```

### Cara Parsing Response:
```typescript
const result = response.candidates[0].content.parts[0].text;
```

### Layout Halaman `curhat.tsx` (Dari Atas ke Bawah):

```
[paddingTop: safeArea.top + 16]

[HEADER]
  Teks "TITIK—KOMA" — sama seperti di layar utama
  Inter_700Bold, fontSize 11, letterSpacing 4, color #2a2a2a, center

[AREA INPUT — flex sisa ruang]
  TextInput multiline:
  - placeholder: "ceritakan dulu, biar aku cariin kata-katanya..."
  - placeholderTextColor: #2a2a2a
  - Style: tidak ada border kotak — hanya border bawah 1px #1e1e1e
  - backgroundColor: transparent
  - fontFamily: Inter_400Regular, fontSize: 18, color: #f0f0f0
  - padding: 24 horizontal, 20 vertical
  - Karakter counter di kanan bawah input: "x/280" — Inter 400, 11px, #444

[AREA HASIL — muncul setelah AI merespons]
  Tampilkan dengan animasi fade in (Reanimated) saat hasil pertama kali muncul
  
  Garis pemisah: 1px #1e1e1e, margin vertikal 16px
  
  Teks hasil quote:
  - fontFamily: PlayfairDisplay_400Regular
  - fontSize: 22, lineHeight: 34, color: #f0f0f0
  - padding: 24 horizontal
  
  Dua tombol di bawah teks hasil (bersebelahan):
  - "SALIN" — outline style (border 1px #333, bg #000, teks #f0f0f0)
  - "BAGIKAN" — filled style (bg #f0f0f0, teks #000)
  - Keduanya: height 44, flex 1, borderRadius 0, margin 16 horizontal

[TOMBOL KIRIM — di atas bottom nav]
  Tombol "RACIK KATA-KATA":
  - width: 100%, height: 56
  - backgroundColor: #000, borderWidth: 1, borderColor: #333
  - borderRadius: 0
  - Saat loading AI: tampilkan teks "sedang meracik..." dengan ActivityIndicator kecil di sebelah kiri
  - Saat tidak loading: teks "RACIK KATA-KATA", Inter_700Bold, letterSpacing 2

  Padding horizontal: 24
  marginBottom: 12 (di atas BottomNav)

[BOTTOM NAV — activeTab: 'curhat']
```

### State yang Dibutuhkan di `curhat.tsx`:
```typescript
const [inputText, setInputText] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [generatedQuote, setGeneratedQuote] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
```

### Error Handling:
- Jika API Key tidak ada (`!process.env.EXPO_PUBLIC_GEMINI_API_KEY`): tampilkan pesan "Fitur AI belum dikonfigurasi" dan nonaktifkan tombol
- Jika input kosong: nonaktifkan tombol kirim (disabled saat `inputText.trim().length === 0`)
- Jika network error: tampilkan toast "Gagal terhubung, coba lagi"
- Jika respons AI tidak valid: tampilkan toast "AI sedang bingung, coba ceritakan lagi"

---

## HALAMAN LAINNYA (`more.tsx`)

Halaman ini adalah gabungan antara daftar bookmark dan pengaturan dasar. Desainnya menggunakan gaya **list/menu flat** tanpa card bergambar.

### Layout `more.tsx` (Dari Atas ke Bawah):

```
[paddingTop: safeArea.top + 16]

[HEADER]
  "TITIK—KOMA" — sama seperti halaman lain

[SEKSI KOLEKSI — judul "TERSIMPAN"]
  Ambil data dari useBookmarks()
  
  Jika kosong: tampilkan teks kecil "Belum ada yang disimpan" — color #333
  
  Jika ada isi: tampilkan maksimal 3 quote pertama sebagai preview singkat
  - Setiap item: teks quote (dipotong 60 karakter + "...") + nama penulis
  - Di bawah preview: tombol "Lihat Semua (x)" yang saat ditekan navigasi ke /saved
  
  Garis pemisah antar seksi: 1px solid #1e1e1e, margin vertikal 24px

[SEKSI PENGATURAN — judul "LAINNYA"]
  Daftar menu flat (TouchableOpacity, tidak ada card/border per item):
  
  Row item style:
  - paddingVertical: 16, paddingHorizontal: 24
  - borderBottom: 1px solid #111 (pemisah antar item sangat subtle)
  - Teks label: Inter_500Medium, fontSize 15, color #888
  - Ikon panah kanan: teks "›", color #333, di kanan

  Menu items:
  1. "Tentang Aplikasi" → tampilkan modal kecil atau alert dengan info singkat app
  2. "Bagikan Aplikasi" → buka share sheet dengan teks "Coba Titik-Koma..."
  3. "Versi 1.0.0" → tidak bisa ditekan, label abu-abu saja

[BOTTOM NAV — activeTab: 'more']
```

---

## MODIFIKASI `index.tsx` (Layar Utama)

Setelah refactor ini, layar utama perlu dimodifikasi:

1. **Hapus** tombol `☰` (koleksi) di pojok kanan atas — navigasi ke koleksi sekarang lewat tab "Lainnya"
2. **Hapus** `topBarSpacer` yang tidak lagi diperlukan (karena tidak ada tombol kanan)
3. **Tambahkan** `<BottomNav activeTab="index" onTabPress={...} />` di bagian paling bawah JSX, **sebelum** `</View>` penutup
4. **Kurangi** `marginBottom` pada `bottomBar` — karena sekarang ada `BottomNav` di bawahnya, tidak perlu margin besar lagi. Ganti `insets.bottom + 24` menjadi `12`

---

## ATURAN KODE WAJIB

1. **TypeScript Strict** — tidak ada `any`. Semua API response harus ditype dengan benar
2. **Komentar Bahasa Indonesia** di seluruh kode baru
3. **StyleSheet.create()** untuk semua style
4. **useSafeAreaInsets** selalu digunakan
5. **Tidak ada `console.log`** di kode final
6. **File `.env`** harus dibuat dengan placeholder, dan dipastikan ada di `.gitignore`

---

## URUTAN EKSEKUSI (Sangat Penting — Ikuti Ini)

Kerjakan dalam urutan ini untuk menghindari error referensi:

1. **Buat `BottomNav.tsx`** terlebih dahulu (komponen independen)
2. **Buat `curhat.tsx`** (halaman baru)
3. **Buat `more.tsx`** (halaman baru, import `useBookmarks`)
4. **Modifikasi `index.tsx`** (hapus tombol koleksi, tambah BottomNav)
5. **Modifikasi `_layout.tsx`** (daftarkan route `curhat` dan `more`)
6. **Buat file `.env`** dengan API key placeholder
7. **Jalankan `npx tsc --noEmit`** — harus 0 error sebelum dinyatakan selesai

---

## CHECKLIST SEBELUM DINYATAKAN SELESAI

- [ ] `npx tsc --noEmit` → **0 error**
- [ ] Bottom nav muncul di ketiga halaman tab (index, curhat, more)
- [ ] Bottom nav TIDAK muncul di halaman share
- [ ] Navigasi antar tab berjalan smooth tanpa menumpuk history
- [ ] Haptic ringan terasa saat pindah tab
- [ ] Halaman Curhat: tombol disabled saat input kosong
- [ ] Halaman Curhat: loading indicator muncul saat menunggu AI
- [ ] Halaman Curhat: hasil AI muncul dengan animasi fade in
- [ ] Halaman Lainnya: preview 3 bookmark teratas muncul (atau pesan kosong)
- [ ] Halaman Lainnya: menu pengaturan flat bisa ditekan
- [ ] File `.env` sudah dibuat dan ada di `.gitignore`
- [ ] Tidak ada elemen yang melanggar Anti-AI-Slop (glassmorphism, gradient, dll)

---

## CATATAN KRITIKAL UNTUK AGEN PELAKSANA

> [!WARNING]
> Halaman `saved.tsx` yang sudah ada dari Fase 2A **JANGAN dihapus** — kontennya masih dibutuhkan sebagai halaman fullscreen yang bisa dinavigasi dari halaman "Lainnya" (`more.tsx`) via tombol "Lihat Semua". Yang berubah hanya: akses ke halaman saved tidak lagi lewat tombol `☰` di header, melainkan lewat tombol di dalam halaman `more.tsx`.

> [!IMPORTANT]
> Untuk pengujian fitur AI di Expo Go: user perlu mengisi API key Gemini yang valid di file `.env`. Tanpa API key, tombol harus tetap bisa ditekan tapi menampilkan pesan error yang informatif — BUKAN crash.

> [!TIP]
> Gemini API key gratis bisa didapatkan di: https://aistudio.google.com/app/apikey — informasikan ini kepada user di file `README.md` project.

---
*Superprompt ini mencakup dua perubahan sekaligus: penambahan fitur AI Curhat (2C) dan refactor struktur navigasi ke bottom tab navigation. Kerjakan secara berurutan sesuai urutan eksekusi yang tertulis.*
