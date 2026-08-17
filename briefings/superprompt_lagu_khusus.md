# SUPERPROMPT: GENERASI 100 QUOTES LAGU (EDISI KHUSUS VIRAL & RELATABLE)

Konteks: Kamu harus menghasilkan quotes dengan kategori "Lagu" untuk aplikasi Gen Z.
Masalah sebelumnya: Lirik yang dihasilkan terlalu tidak terkenal, *obscure*, atau mengambil bait acak yang tidak bermakna jika dipotong.
TUGAS BARU: Kamu HARUS mengambil **potongan lirik paling ikonik (punchline / chorus viral / jembatan emosional)** yang sering dijadikan caption Instagram atau viral di TikTok. Lirik harus bisa "berdiri sendiri" dan langsung memberikan efek *nyesek*, sedih, atau *relatable*.

## ATURAN SUMBER LAGU (SANGAT KETAT)

**A. Artis Indonesia:**
WAJIB ambil lirik ikonik dari:
- **Bernadya**: "Satu Bulan", "Apa Mungkin", "Kini Mereka Tahu" (lirik galau brutal)
- **Nadin Amizah**: "Rayuan Perempuan Gila", "Bertaut", "Sorai", "Taruh"
- **Juicy Luicy**: "Lantas", "Sialan", "Tanpa Tergesa", "Tampar"
- **Mahalini**: "Sial", "Kisah Sempurna", "Mati-matian"
- **Hindia**: "Evaluasi", "Secukupnya", "Rumah ke Rumah", "Cincin"
- **Tiara Andini**: "Usai", "Merasa Indah"
- **Kunto Aji**: "Rehat", "Pilu Membiru", "Terlalu Lama Sendiri"
- **Pamungkas**: "To The Bone", "Kenangan Manis"
- **Tulus**: "Hati-Hati di Jalan", "Monokrom", "Diri", "Ruang Sendiri"
- **Ghea Indrawari**: "Jiwa Yang Bersedih"
- **Sheila On 7**: (Pilih lirik paling *legend* dan *relatable*)

**B. Artis Internasional:**
WAJIB ambil lirik ikonik dari:
- **Taylor Swift**: (Pilih yang punchline seperti "I gave you all my best me's", "You're losing me", "I'd give you my sunshine", lirik jembatan dari *All Too Well*, *Cruel Summer*, *August*, *Exile*)
- **Olivia Rodrigo**: "Vampire", "Traitor", "Drivers License", "Happier", "Logical"
- **Billie Eilish**: "What Was I Made For?", "Happier Than Ever", "TV", "Ocean Eyes"
- **Lana Del Rey**: "Summertime Sadness", "Radio", "Cinnamon Girl", "Young and Beautiful"
- **Conan Gray**: "Heather", "Memories", "Maniac"
- **NIKI**: "Take A Chance With Me", "Every Summertime", "Oceans & Engines", "Autumn", "High School in Jakarta"
- **Joji**: "Glimpse of Us", "Slow Dancing in the Dark", "Die For You"
- **SZA**: "Kill Bill", "Snooze", "Good Days"
- **Arctic Monkeys**: "505", "Do I Wanna Know"
- **Radiohead**: "Creep", "No Surprises"
- **Rex Orange County**: "Pluto Projector", "Best Friend"
- **Bruno Mars**: "When I Was Your Man", "Talking to the Moon"
- **The Weeknd**: "Die For You", "Call Out My Name"

## ATURAN PEMILIHAN LIRIK:
1. **JANGAN ASAL POTONG:** Ambil 1-3 baris yang utuh maknanya.
2. **PILIH YANG BIKIN NYESEK / RELATE:** Lirik harus berbicara tentang *overthinking*, patah hati, *move on* gagal, cinta bertepuk sebelah tangan, lelah dengan hidup, atau *self-love*.
3. **DIKENAL LUAS:** Kalau orang baca liriknya, mereka otomatis bernyanyi di kepalanya.

## SKEMA JSON:
Sama persis dengan aturan sebelumnya.
```json
{
  "id": "q[nomor]",
  "text": "[Lirik lagu, jangan dikasih tanda kutip di awal/akhir string]",
  "author": "[Nama Artis]",
  "source": "[Judul Lagu]",
  "category": "Lagu",
  "language": "[id / en]",
  "length": "[short / medium]",
  "tags": ["[tag-1]", "[tag-2]", "[tag-3]"]
}
```
Gunakan 32 tags Gen Z yang sama (patah-hati, overthinking, capek, mental-health, dll).
