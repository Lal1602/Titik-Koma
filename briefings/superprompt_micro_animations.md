# Superprompt: Micro-Interactions & Animasi Transisi Quote — Titik-Koma

## Konteks Proyek
Kita sedang membangun aplikasi mobile **Titik-Koma** menggunakan **React Native + Expo SDK 54** dengan **TypeScript**. Library animasi yang **wajib digunakan** adalah **`react-native-reanimated` versi 3** (sudah terinstall). **DILARANG** menggunakan `Animated` dari `react-native` bawaan karena lebih lambat dan tidak berjalan di UI Thread.

Desain sistem: **Anti-AI-Slop** — flat, minimalis, Neo-Brutalism. Animasi yang diinginkan bukan animasi yang "wah" dan penuh efek, melainkan animasi yang **subtil, dramatis, dan syahdu** — seperti membaca puisi yang perlahan terungkap.

File-file utama yang relevan:
- `src/components/QuoteDisplay.tsx` — komponen utama penampil teks quote (sudah ada animasi fade dasar)
- `src/components/BookmarkButton.tsx` — tombol bintang (sudah ada animasi spring dasar)
- `src/app/index.tsx` — halaman utama
- `src/components/CategoryFilter.tsx` — filter kategori (chip horizontal)

---

## Filosofi Animasi Titik-Koma
> *"Animasi bukan hiasan. Animasi adalah napas dari antarmuka."*

Setiap animasi yang kita buat harus memenuhi tiga syarat:
1. **Purposeful (Bertujuan):** Animasi menjelaskan perubahan state, bukan sekadar dekorasi.
2. **Subtle (Subtil):** Durasi cepat (150-500ms), tidak ada *bounce* yang berlebihan atau efek warna yang menyolok.
3. **Consistent (Konsisten):** Semua elemen interaktif memberikan umpan balik (feedback) visual yang seragam.

---

## Daftar Animasi yang Harus Diimplementasikan

### 1. Transisi Quote (PALING PRIORITAS) — `QuoteDisplay.tsx`

**Masalah saat ini:** Pergantian quote saat tombol "Cari Rasa" ditekan terasa instan dan kaku. Tidak ada drama.

**Solusi — Animasi "Halaman Buku yang Dibalik":**
Saat quote berganti, terapkan animasi 2 fase:
- **Fase 1 (Fade Out + Geser Naik):** Quote lama memudar keluar sambil bergerak naik tipis.
  - `opacity`: 1 → 0, durasi 200ms, easing `Easing.in(Easing.ease)`
  - `translateY`: 0 → -10, durasi 200ms
- **Fase 2 (Reset Posisi + Fade In + Geser Naik dari Bawah):** Quote baru masuk dari bawah sambil muncul perlahan.
  - `translateY` reset ke +12 (di bawah posisi awal)
  - `opacity`: 0 → 1, durasi 350ms, dengan **delay 100ms**, easing `Easing.out(Easing.ease)`
  - `translateY`: +12 → 0, durasi 350ms, dengan delay 100ms
- Total durasi siklus: ~650ms. Terasa lambat tapi syahdu — seperti halaman buku yang dibalik perlahan.

**Implementasi dengan `useSharedValue` dan `withTiming`:**
```tsx
// Di QuoteDisplay.tsx
const opacity = useSharedValue(1);
const translateY = useSharedValue(0);

// Dipanggil saat prop `quote.id` berubah (via useEffect dengan deps [quote.id])
const animateTransition = () => {
  // Fase 1: Keluar
  opacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) });
  translateY.value = withTiming(-10, { duration: 200 });

  // Fase 2: Masuk (dengan delay)
  opacity.value = withDelay(200, withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) }));
  translateY.value = withDelay(200, withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) }));
};
```
*Catatan: Reset `translateY` ke +12 harus dilakukan pada frame yang sama saat delay dimulai, gunakan `runOnJS` atau atur ulang sebelum `withDelay` berjalan.*

---

### 2. Animasi Tombol "Cari Rasa" — `index.tsx`

**Masalah saat ini:** Tombol "Cari Rasa" tidak memberikan umpan balik visual apapun selain `activeOpacity` bawaan (hanya redupkan warna).

**Solusi — Animasi "Press Down":**
Saat tombol ditekan (`onPressIn`), tombol sedikit mengecil — memberikan ilusi tombol yang sungguh ditekan ke dalam.
- `scale`: 1 → 0.97, durasi 80ms, easing `Easing.out(Easing.ease)`
- Saat dilepas (`onPressOut`): `scale`: 0.97 → 1, durasi 150ms, easing `Easing.out(Easing.back(1.5))`

Ubah `TouchableOpacity` pada tombol "Cari Rasa" menjadi `Animated.View` + `Pressable`:
```tsx
const scaleValue = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scaleValue.value }],
}));

<Pressable
  onPressIn={() => { scaleValue.value = withTiming(0.97, { duration: 80 }); }}
  onPressOut={() => { scaleValue.value = withSpring(1, { damping: 10, stiffness: 200 }); }}
  onPress={handleNextQuote}
>
  <Animated.View style={[styles.button, animatedStyle]}>
    <Text style={styles.buttonText}>CARI RASA</Text>
  </Animated.View>
</Pressable>
```

---

### 3. Animasi Bookmark/Favorit — `BookmarkButton.tsx`

**Masalah saat ini:** Animasi bintang sudah ada (spring scale), tapi belum ada perbedaan visual antara status "tersimpan" dan "belum tersimpan" yang dramatis.

**Solusi — Animasi "Bintang Menyala":**
- Saat bookmark **diaktifkan** (bintang ☆ → ★):
  - Ikon bintang melakukan `scale`: 1 → 1.5 → 1 (spring bounce, damping rendah = 4, stiffness = 300)
  - Sebuah `View` melingkar tak terlihat (`opacity 0`) muncul sesaat (`opacity`: 0 → 0.3 → 0, `scale`: 0.5 → 1.5) — efek "kilatan" kecil yang subtil menandai aksi berhasil.
- Saat bookmark **dinonaktifkan** (★ → ☆):
  - Ikon cukup melakukan `scale`: 1 → 0.85 → 1 (lebih kecil, tanpa bounce berlebihan) — berasa seperti "melepaskan".

**Implementasi:**
```tsx
const scale = useSharedValue(1);
const flashOpacity = useSharedValue(0);
const flashScale = useSharedValue(0.5);

const triggerBookmark = (isNowBookmarked: boolean) => {
  if (isNowBookmarked) {
    scale.value = withSpring(1.5, { damping: 4, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 8 });
    });
    flashOpacity.value = withSequence(
      withTiming(0.3, { duration: 100 }),
      withTiming(0, { duration: 200 })
    );
    flashScale.value = withTiming(1.8, { duration: 300 });
  } else {
    scale.value = withSpring(0.85, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 8 });
    });
  }
};
```

---

### 4. Animasi Chip Filter Kategori — `CategoryFilter.tsx`

**Masalah saat ini:** Saat user menekan chip filter (Semua / Sastra / Film / dll), perpindahan status aktif/nonaktif terjadi instan tanpa transisi.

**Solusi — Animasi Fade Crossfade Teks:**
- Warna *background* chip aktif bertransisi dengan `withTiming` (durasi 200ms), bukan langsung.
- Karena `StyleSheet.create` tidak bisa dianimasikan langsung, gunakan `Animated.View` sebagai wrapper chip dengan style background yang dianimasikan:
```tsx
// Tiap chip punya sharedValue sendiri untuk opacity background-nya
const bgOpacity = useSharedValue(isActive ? 1 : 0);

useEffect(() => {
  bgOpacity.value = withTiming(isActive ? 1 : 0, { duration: 200 });
}, [isActive]);
```

---

### 5. Animasi "Muncul Pertama Kali" Saat App Dibuka — `index.tsx`

**Masalah saat ini:** Saat aplikasi pertama kali dibuka (setelah font selesai dimuat dan SplashScreen disembunyikan), semua elemen langsung muncul sekaligus secara brutal.

**Solusi — Animasi "Stagger Reveal":**
Buat beberapa `useSharedValue` untuk berbagai bagian halaman (header, filter, quote, tombol) dan animasikan kemunculannya secara berurutan (stagger) dengan delay berbeda:
- `opacity` semua elemen: mulai dari 0.
- Header muncul pertama: delay 100ms, durasi 400ms.
- Filter Chip muncul: delay 250ms, durasi 400ms.
- Area Quote muncul: delay 400ms, durasi 500ms (lebih lambat = paling dramatis).
- Tombol bawah muncul: delay 550ms, durasi 400ms.
- Setiap elemen juga melakukan `translateY`: +15 → 0 bersamaan dengan fade-in.

---

## Hal-Hal yang DILARANG (Anti-AI-Slop)
- ❌ TIDAK BOLEH menggunakan `Animated` dari `react-native`. Harus `react-native-reanimated`.
- ❌ TIDAK BOLEH membuat animasi yang durasinya > 600ms (terasa lambat dan mengganggu).
- ❌ TIDAK BOLEH menambahkan animasi rotasi (spin), efek warna berubah-ubah (color cycling), atau efek partikel.
- ❌ TIDAK BOLEH ada animasi yang loop terus-menerus (looping animation) tanpa alasan UX yang kuat.
- ❌ TIDAK BOLEH menggunakan `Lottie` atau library animasi tambahan lainnya. Semua harus dibangun manual dengan `react-native-reanimated`.
- ❌ TIDAK BOLEH mengubah layout atau ukuran komponen apapun dalam proses ini.

---

## Hasil Akhir yang Diharapkan
Setelah implementasi selesai, keseluruhan aplikasi akan terasa **hidup dan responsif** tanpa terasa noisy atau berlebihan. Setiap sentuhan user akan direspons dengan umpan balik visual yang halus. Pergantian quote akan terasa seperti "membuka halaman buku" yang penuh dengan suasana.
