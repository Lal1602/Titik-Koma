# ✒️ TITIK—KOMA

> *"Karena produktif itu bagus, tapi istirahat juga bukan dosa."*

**Titik-Koma** adalah aplikasi ruang jeda minimalis yang dirancang khusus untuk Gen Z. Sebuah pelarian digital dari *hustle culture*, *overthinking*, dan hiruk-pikuk media sosial. Aplikasi ini menawarkan koleksi kata-kata (quotes) yang sangat *relatable*, puitis, dan menyentuh hati, dipadukan dengan asisten AI simpatik yang siap mendengarkan curhatanmu kapan saja.

---

## ✨ Fitur Utama

- **🖤 Koleksi Quotes Relatable (Vibe Gen Z)**  
  Berisi kurasi lirik lagu *aesthetic*, dialog film, kutipan sastra, hingga celetukan kehidupan sehari-hari (*quarter-life crisis*, *mental health*, asmara). Semuanya anti-alay dan tidak *cringe*. Tersedia fitur filter: Semua, Sastra, Film, Lagu, Relatable, dan IG Notes.

- **💬 Curhat AI (Teman Cerita Rahasia)**  
  Ditenagai oleh model AI generatif (Google Gemini). Kamu bisa mengetik apa saja—sedang lelah, *burnout*, atau sekadar butuh divalidasi—dan AI akan membalas dengan satu kalimat *quote* spesifik layaknya seorang teman yang menepuk pundakmu, lengkap dengan opsi untuk menyalin atau membagikannya.

- **🎨 Bagikan Sebagai Gambar (Aesthetic Canvas)**  
  Tinggalkan tangkapan layar biasa! Ubah *quote* favoritmu menjadi gambar estetik *Full HD* siap pamer ke IG Story, X (Twitter), atau status WhatsApp.  
  Tersedia 4 gaya visual eksklusif:
  - **Hitam (Neo-Brutalism):** Bold, minimalis, rapi.
  - **Kertas (Vintage Polaroid):** Tekstur kertas tua yang klasik.
  - **Abu (Thread X):** Bersih, modern, menyerupai cuitan.
  - **Malam (Starry Night):** Desain ala pemutar musik dengan *progress bar* melankolis.
  
  Mendukung berbagai rasio layar otomatis: `1:1`, `4:3`, `16:9`, dan `9:16`.

- **📅 Kutipan Hari Ini (Quote of the Day)**  
  Setiap kali membuka aplikasi di hari yang baru, kamu akan disambut oleh satu kalimat spesial yang dipilih secara acak namun deterministik berdasarkan tanggal hari itu.

- **🔖 Koleksi Pribadi (Bookmark)**  
  Simpan kalimat-kalimat yang menampar atau mewakili perasaanmu ke dalam koleksi pribadi untuk dibaca lagi saat kamu butuh pengingat.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi modern untuk memastikan performa yang cepat dan pengalaman UI/UX yang *smooth*:

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (dengan Expo Router untuk navigasi)
- **Styling:** React Native StyleSheet (dioptimalkan dengan filosofi *Design System* khusus)
- **AI Integration:** `@google/generative-ai` (Gemini API)
- **Storage:** `@react-native-async-storage/async-storage` (100% offline, privasi aman!)
- **Tools Tambahan:** `expo-haptics` (untuk interaksi sentuhan yang premium), `react-native-view-shot` (untuk merender kanvas gambar HD), `expo-clipboard`.

---

## 🚀 Cara Menjalankan di Komputer Lokal

Ingin mencoba menjalankan atau berkontribusi pada proyek ini? Ikuti langkah mudah berikut:

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/username/TitikKoma.git
   cd TitikKoma
   ```

2. **Install semua dependensi:**
   ```bash
   npm install
   ```

3. **Atur API Key AI (Wajib untuk fitur Curhat AI):**
   - Buat file `.env` di *root* folder proyek.
   - Tambahkan kunci Gemini API kamu:
     ```env
     EXPO_PUBLIC_GEMINI_API_KEY=masukkan_api_key_kamu_di_sini
     ```

4. **Jalankan Development Server:**
   ```bash
   npx expo start --clear
   ```

5. **Buka di HP atau Emulator:**
   - Gunakan aplikasi **Expo Go** di Android/iOS dan *scan* QR code yang muncul di terminal.
   - Atau tekan `a` untuk membuka di Android Emulator, dan `i` untuk iOS Simulator.

---

## 📸 Cuplikan Layar (Screenshots)

*(Ganti URL di bawah ini dengan gambar screenshot aplikasimu yang sebenarnya saat kamu push ke GitHub!)*

<div align="center">
  <img src="./assets/images/preview/utama.png" width="22%" alt="Layar Utama" />
  <img src="./assets/images/preview/pratinjau.png" width="22%" alt="Pratinjau Ekspor Gambar" />
  <img src="./assets/images/preview/curhat.png" width="22%" alt="Curhat AI" />
  <img src="./assets/images/preview/lainnya.png" width="22%" alt="Koleksi dan Pengaturan" />
</div>

---

## 🤝 Kontribusi

Merasa ada *quote* lirik lagu atau sastra yang belum masuk dan wajib ada? Ingin memperbaiki *bug* atau menambahkan animasi transisi yang lebih kece? *Pull Request* sangat diterima! Pastikan untuk mengikuti gaya bahasa dan estetika desain yang sudah ada (tidak norak/alay).

## 📄 Lisensi

Proyek ini menggunakan lisensi MIT. Silakan modifikasi, pelajari, dan gunakan secara bebas. Jangan lupa beristirahat hari ini.
