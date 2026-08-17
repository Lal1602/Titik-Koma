# SUPERPROMPT: Tambah 600 Quotes ke Database Titik-Koma

> Dokumen ini adalah instruksi lengkap, padat, dan teknis untuk menambahkan 600 quotes baru ke dalam file data/quotes_draft.json. Baca seluruh dokumen ini dari atas ke bawah sebelum mulai mengeksekusi apapun.

---

## 🎯 KONTEKS PROYEK

**Aplikasi:** Titik-Koma — sebuah mobile app kutipan estetik untuk Gen Z Indonesia.

**Visi desain:** Quotes yang dimuat harus terasa seperti sesuatu yang kamu *screenshot* tanpa berpikir dua kali. Bukan motivasi klise MLM, bukan ceramah, tapi kata-kata yang bikin dada sesak dengan cara yang indah.

**Target audiens:** Gen Z Indonesia, 16-25 tahun. Mereka mengerti bahasa gaul, lagu Barat, film populer, puisi Indonesia, dan merasa punya koneksi emosional dengan teks yang *relate* ke kehidupan nyata mereka.

---

## 📋 SKEMA DATA (WAJIB DIIKUTI PERSIS)

Setiap quote yang ditambahkan HARUS memiliki struktur JSON persis seperti ini:

`json
{
  "id": "q[nomor 3 digit berurutan dari q101 ke atas]",
  "text": "Teks kutipan itu sendiri, tidak boleh ada tanda kutip pembuka/penutup di sini",
  "author": "Nama penulis, karakter, atau band/penyanyi",
  "source": "Judul buku/film/serial/album/lagu/platform (opsional tapi sangat dianjurkan)",
  "category": "[Sastra | Film | Lagu | Relatable | IG Notes]",
  "language": "[id | en]",
  "length": "[short | medium | long]",
  "tags": ["tag-1", "tag-2", "tag-3"]
}
`

### Aturan length:
- short: <= 60 karakter (WAJIB untuk semua quotes di kategori IG Notes)
- medium: 61-120 karakter
- long: > 120 karakter

### Aturan language:
- id = Bahasa Indonesia
- en = Bahasa Inggris

---

## 📦 TARGET: 600 QUOTES BARU

| Kategori | Jumlah | Bahasa | Keterangan |
|---|---|---|---|
| Sastra | 100 | 70% id, 30% en | Penulis, pujangga, filsuf, penyair |
| Film | 100 | 60% en, 40% id | Dialog dari film populer |
| Lagu | 100 | 70% en, 30% id | Lirik lagu populer yang puitis |
| Relatable | 100 | 80% id, 20% en | Quotes kehidupan nyata Gen Z |
| IG Notes | 100 | 50% id, 50% en | Wajib <= 60 karakter |

---

## 🏷️ 32 TAG VIBE GEN Z (WAJIB TERDISTRIBUSI)

Setiap tag di bawah ini minimal muncul di 10-15 quotes. Satu quote BOLEH memiliki 2-4 tags.

### Grup 1: Quarter-Life Crisis & Lelah Mental
1. quarter-life-crisis
2. urnout
3. overthinking
4. mental-health
5. nxiety
6. capek
7. susah-tidur
8. 	ekanan
9. rah-hidup

### Grup 2: Healing & Penerimaan Diri
10. self-care
11. self-paced
12. self-discovery
13. jati-diri
14. izin-lemah
15. aik-baik-saja
16. langkah-kecil
17. progres

### Grup 3: Asmara & Kegalauan Sosial
18. move-on
19. patah-hati
20. curhat
21. introvert
22. 	openg
23. sepi
24. sendu
25. kesepian

### Grup 4: Vibe Estetik & Musik
26. late-night-drive
27. coming-of-age
28. escapism
29. melankolis
30. euphoria
31. heartbreak-anthem
32. 
ostalgia-trip

---

## 📚 KATEGORI: SASTRA (100 Quotes, ID q101-q200)

### Sumber Wajib:

**Penulis Indonesia (target >= 50 quotes):**
- Sapardi Djoko Damono (JANGAN duplikat "Aku ingin mencintaimu..." yang sudah ada)
- Pramoedya Ananta Toer (Bumi Manusia, Anak Semua Bangsa)
- Chairil Anwar (puisi)
- Dee Lestari (Perahu Kertas, Supernova, Madre)
- Tere Liye (novel populer)
- Andrea Hirata (Laskar Pelangi)
- Ayu Utami (Saman)
- Jalaluddin Rumi (versi terjemahan Indonesia)

**Penulis Barat/Internasional (target >= 30 quotes):**
- F. Scott Fitzgerald (The Great Gatsby)
- Sylvia Plath (The Bell Jar, Ariel)
- Oscar Wilde (esai, drama, puisi)
- Haruki Murakami (Norwegian Wood, Kafka on the Shore)
- Rupi Kaur (Milk and Honey, The Sun and Her Flowers)
- Rainer Maria Rilke (Letters to a Young Poet)
- Albert Camus (The Stranger, The Myth of Sisyphus)
- Virginia Woolf (prosa)
- Pablo Neruda (puisi)

**Filsuf (target >= 20 quotes):**
- Friedrich Nietzsche
- Soren Kierkegaard
- Simone de Beauvoir
- Marcus Aurelius (Meditations)

### Ketentuan Khusus Sastra:
- TIDAK BOLEH memuat kutipan motivasi generik
- Prioritaskan kutipan dengan kedalaman emosional yang bisa dimaknai berbeda
- Distribusi tag: patah-hati, sepi, melankolis, self-discovery, jati-diri, rah-hidup, overthinking, nxiety, coming-of-age, 
ostalgia-trip, escapism

---

## 🎬 KATEGORI: FILM (100 Quotes, ID q201-q300)

### Sumber Wajib:

**Film Hollywood/International:**
- The Perks of Being a Wallflower (dialog SELAIN "We accept the love we think we deserve" yang sudah ada)
- Eternal Sunshine of the Spotless Mind (dialog Joel/Clementine)
- Her (dialog Theodore/Samantha tentang kesepian digital)
- Lady Bird (identitas, keluarga, meninggalkan rumah)
- Call Me by Your Name (perasaan dan penyesalan)
- Little Miss Sunshine (kegagalan dan impian)
- Silver Linings Playbook (kesehatan mental)
- Good Will Hunting (potensi dan rasa takut)
- 500 Days of Summer (harapan dan realita)
- Interstellar (waktu dan cinta)
- Spirited Away / Howl's Moving Castle (Miyazaki)
- Parasite (Bong Joon-ho)
- Marriage Story (hubungan yang kompleks)
- Moonlight (identitas dan maskulinitas)

**Film Indonesia:**
- Ada Apa Dengan Cinta (AADC)
- Dilan 1990
- Imperfect (body image dan self-love)
- Nanti Kita Cerita tentang Hari Ini (NKCTHI)
- Filosofi Kopi (passion dan pekerjaan)
- Laskar Pelangi

**Serial:**
- Normal People (Hulu)
- Fleabag (BBC)
- Euphoria (HBO)
- Sex Education (Netflix)
- Bojack Horseman

### Ketentuan Khusus Film:
- WAJIB verifikasi dialog benar-benar ada di film
- Format author: "[Nama Karakter], [Judul Film]"
- Source: judul film/serial
- Distribusi tag: patah-hati, move-on, heartbreak-anthem, mental-health, nxiety, urnout, sepi, kesepian, introvert, coming-of-age, rah-hidup, self-discovery, jati-diri, 	openg

---

## 🎵 KATEGORI: LAGU (100 Quotes, ID q301-q400)

### Sumber Wajib:

**Artis Internasional (70 quotes):**
- Taylor Swift: era Folklore, Evermore, Midnights, 1989 (lirik puitis, bukan chorus klise)
- Lana Del Rey: Video Games, Young and Beautiful, Blue Jeans, National Anthem
- Radiohead: Creep, Karma Police, Fake Plastic Trees
- The 1975: The Ballad of Me and My Brain, Somebody Else, I Always Wanna Die
- Billie Eilish: When We All Fall Asleep, Happier Than Ever
- Hozier: Take Me to Church, Cherry Wine, From Eden
- Bon Iver: Skinny Love, Holocene, Flume
- Arctic Monkeys: Do I Wanna Know, 505, Why'd You Only Call Me When You're High
- Frank Ocean: Pink + White, Ivy, Self Control
- Cigarettes After Sex: Nothing's Gonna Hurt You Baby, Apocalypse
- Phoebe Bridgers: Motion Sickness, Savior Complex, Garden Song
- Rex Orange County: Best Friend, Loving Is Easy, Untitled
- Harry Styles: Cherry, Matilda, Falling
- Sufjan Stevens: Death With Dignity, Eugene
- Mitski: Your Best American Girl, Nobody, First Love/Late Spring

**Artis Indonesia (30 quotes):**
- Tulus: Baru, Monokrom, Gajah, Pamit
- Hindia: Rumah Ke Rumah, Secukupnya, Evaluasi
- Kunto Aji: Terlalu Lama Sendiri, Rehat
- Reality Club: Let Me Handle This on My Own, Treat Me Better
- Fourtwnty: Zona Nyaman, Aku Bukan Untukmu
- Float: Kosong, Melompat Lebih Tinggi
- Payung Teduh: lirik puitis

### Ketentuan Khusus Lagu:
- Format author: Nama artis/band
- Format source: "Nama Lagu (Nama Album)"
- WAJIB akurat, ambil verbatim dari lirik terverifikasi
- HINDARI lirik eksplisit atau chorus yang terlalu generik
- Distribusi tag: late-night-drive, escapism, melankolis, heartbreak-anthem, patah-hati, move-on, euphoria, coming-of-age, 
ostalgia-trip, sepi, overthinking, aik-baik-saja, self-discovery, sendu

---

## 💬 KATEGORI: RELATABLE (100 Quotes, ID q401-q500)

### Sumber Wajib:

**Anonymous / Komunitas:**
- Quotes dari Twitter/X viral (author: "Anonim" atau "Twitter/X")
- Ungkapan umum Gen Z yang sudah jadi bahasa bersama

**Tokoh Modern:**
- Alain de Botton (kecemasan modern)
- Brene Brown (kerentanan dan keberanian)
- Mark Manson (The Subtle Art of Not Giving a F*ck)
- Glennon Doyle (self-acceptance)
- Elizabeth Gilbert (Big Magic)

### Ketentuan Khusus Relatable:
- Bahasa Indonesia yang natural, boleh sedikit gaul tapi tetap estetik
- WAJIB hindari: "kamu pasti bisa!", "jangan pernah menyerah", "hidup itu indah"
- Quotes yang bikin orang mikir "ini gue banget"
- Distribusi tag: overthinking, urnout, quarter-life-crisis (dominan), capek, susah-tidur, 	ekanan, aik-baik-saja, 	openg, curhat, self-care, izin-lemah, langkah-kecil, rah-hidup, progres, self-paced, introvert, sepi, kesepian

---

## 📌 KATEGORI: IG NOTES (100 Quotes, ID q501-q600)

### Aturan Mutlak:
- Maksimum **60 karakter** — TIDAK BISA dilanggar. Hitung karakter sebelum submit.
- length SELALU short
- Harus bisa dibaca sekilas dan langsung berdampak
- Tidak butuh konteks — berdiri sendiri
- Tidak boleh ada emoji

### Contoh LOLOS (<= 60 karakter):
- "Not all those who wander are lost." (36 karakter)
- "Kadang kamu hanya perlu didengar." (34 karakter)
- "She was chaos. He was art." (27 karakter)
- "Aku terlalu lelah untuk tidak apa-apa." (39 karakter)

### Contoh TIDAK LOLOS (> 60 karakter):
- "Mungkin kita memang tidak ditakdirkan untuk bersama, tapi aku senang pernah mengenalmu." (89 karakter)

### Distribusi Tag: Semua 32 tag harus muncul minimal 2-3 kali di kategori ini.

---

## ✅ CHECKLIST KUALITAS

Validasi setiap quotes sebelum memasukkan ke JSON:
- [ ] id unik dan berformat q[3 digit]?
- [ ] category: Sastra | Film | Lagu | Relatable | IG Notes?
- [ ] language: id atau en?
- [ ] length: dihitung dengan benar (short <=60, medium 61-120, long >120)?
- [ ] IG Notes selalu length: "short"?
- [ ] Minimal 1 tag dari 32 tag?
- [ ] Terasa relate, estetik, tidak alay, tidak lebay?
- [ ] Sumber bisa diverifikasi?
- [ ] Tidak duplikat quotes yang sudah ada?
- [ ] JSON valid?

---

## 🚫 LARANGAN KERAS

1. Quotes motivasi MLM/seminar: "Bermimpilah setinggi langit!", "Sukses adalah pilihan"
2. Quotes agama yang terasa seperti ceramah
3. Quotes alay/lebay: teks dengan banyak tanda seru atau emoji
4. Emoji dalam field 	ext
5. Quotes yang glorifikasi self-harm atau depresi
6. Quotes dari sumber tidak terverifikasi (kecuali ditandai "Anonim")
7. Duplikat konten dari quotes yang sudah ada
8. Lirik eksplisit secara seksual atau kekerasan fisik

---

## 📊 TARGET DISTRIBUSI TAG (Minimal Kemunculan di 600 Quotes)

| Tag | Min. Muncul | Kategori Utama |
|---|---|---|
| quarter-life-crisis | 15 | Relatable, Sastra |
| urnout | 15 | Relatable, Film |
| overthinking | 18 | Relatable, Sastra, Lagu |
| mental-health | 12 | Film, Relatable |
| nxiety | 12 | Relatable, Lagu |
| capek | 10 | Relatable, IG Notes |
| susah-tidur | 8 | Relatable, Lagu |
| 	ekanan | 10 | Relatable, Sastra |
| rah-hidup | 12 | Sastra, Film, Relatable |
| self-care | 12 | Relatable, IG Notes |
| self-paced | 10 | Relatable, Sastra |
| self-discovery | 15 | Sastra, Film |
| jati-diri | 12 | Film, Sastra, Relatable |
| izin-lemah | 10 | Relatable, IG Notes |
| aik-baik-saja | 12 | Relatable, Film, Lagu |
| langkah-kecil | 8 | Relatable, IG Notes |
| progres | 8 | Relatable, IG Notes |
| move-on | 15 | Lagu, Film, IG Notes |
| patah-hati | 20 | Lagu, Film, Sastra |
| curhat | 8 | Relatable, IG Notes |
| introvert | 10 | Relatable, Lagu, Film |
| 	openg | 10 | Film, Relatable |
| sepi | 15 | Sastra, Film, Lagu |
| sendu | 12 | Lagu, Sastra |
| kesepian | 10 | Film, Sastra, IG Notes |
| late-night-drive | 12 | Lagu, IG Notes |
| coming-of-age | 12 | Film, Lagu, Sastra |
| escapism | 10 | Lagu, Film |
| melankolis | 15 | Lagu, Sastra, IG Notes |
| euphoria | 8 | Lagu, Film |
| heartbreak-anthem | 12 | Lagu, IG Notes |
| 
ostalgia-trip | 10 | Lagu, Sastra, IG Notes |

---

## 🔄 STRATEGI EKSEKUSI BATCH

Eksekusi dalam 5 batch untuk memastikan kualitas:

- Batch 1: Sastra (q101-q200)
- Batch 2: Film (q201-q300)
- Batch 3: Lagu (q301-q400)
- Batch 4: Relatable (q401-q500)
- Batch 5: IG Notes (q501-q600)

Validasi JSON setelah setiap batch:
`ash
node -e "JSON.parse(require('fs').readFileSync('data/quotes_draft.json', 'utf8')); console.log('JSON Valid')"
`

Cek distribusi kategori setelah semua batch selesai:
`ash
node -e "const d = JSON.parse(require('fs').readFileSync('data/quotes_draft.json', 'utf8')); const cats = d.reduce((a,q) => { a[q.category] = (a[q.category]||0)+1; return a; }, {}); console.log(JSON.stringify(cats, null, 2))"
`

---

*Versi: 1.0 | Titik-Koma | 2026-08-17*
