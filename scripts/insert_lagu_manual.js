const fs = require('fs');
const path = require('path');

const quotes = [
  { text: "Belum ada satu bulan, ku yakin kau belum bisa hapus semua memori kita.", author: "Bernadya", source: "Satu Bulan", language: "id", tags: ["patah-hati", "move-on", "melankolis"] },
  { text: "Apa mungkin caraku bicara? Apa mungkin tawaku yang kurang ceria?", author: "Bernadya", source: "Apa Mungkin", language: "id", tags: ["overthinking", "insecure", "sendu"] },
  { text: "Kini mereka tahu, kau tak sebaik itu. Kini mereka tahu, aku yang selalu mengalah.", author: "Bernadya", source: "Kini Mereka Tahu", language: "id", tags: ["jujur", "marah", "capek"] },
  { text: "Memang tidak mudah mencintai diri ini, namun aku tahu kau pasti bisa menerima.", author: "Nadin Amizah", source: "Rayuan Perempuan Gila", language: "id", tags: ["insecure", "cinta", "mental-health"] },
  { text: "Kau dan aku tahu, jalan kita tak sama. Biarlah kita jadi kenangan paling indah.", author: "Nadin Amizah", source: "Sorai", language: "id", tags: ["patah-hati", "nostalgia-trip", "penerimaan"] },
  { text: "Keras kepalaku sama denganmu, caraku marah, caraku tersenyum, seperti detak jantung yang bertaut.", author: "Nadin Amizah", source: "Bertaut", language: "id", tags: ["keluarga", "relatable", "hangat"] },
  { text: "Lantas mengapa ku masih menaruh hati, padahal ku tahu kau takkan pernah kembali.", author: "Juicy Luicy", source: "Lantas", language: "id", tags: ["gagal-move-on", "patah-hati", "overthinking"] },
  { text: "Sialan, ternyata ku masih merindukanmu walau kau telah lukai hatiku berkali-kali.", author: "Juicy Luicy", source: "Sialan", language: "id", tags: ["marah", "gagal-move-on", "relatable"] },
  { text: "Tampar aku di pipi, biar sadar kau takkan pernah jadi milikku.", author: "Juicy Luicy", source: "Tampar", language: "id", tags: ["sadar-diri", "patah-hati", "sendu"] },
  { text: "Sial, mengapa ku harus jatuh cinta pada orang yang tak pernah bisa kumiliki.", author: "Mahalini", source: "Sial", language: "id", tags: ["patah-hati", "kesal", "cinta-bertepuk-sebelah-tangan"] },
  { text: "Tenggelam dalam kisah sempurna, namun nyatanya kita hanyalah sebatas pernah.", author: "Mahalini", source: "Kisah Sempurna", language: "id", tags: ["nostalgia-trip", "melankolis", "move-on"] },
  { text: "Bersedihlah secukupnya, menarilah dan terus tertawa walau dunia tak seindah surga.", author: "Hindia", source: "Secukupnya", language: "id", tags: ["baik-baik-saja", "mental-health", "self-care"] },
  { text: "Banyak hal yang tak bisa kita paksakan, hari ini belum tentu lebih buruk dari kemarin.", author: "Hindia", source: "Evaluasi", language: "id", tags: ["burnout", "harapan", "progres"] },
  { text: "Pindah berkala dari rumah ke rumah, mencari tempat yang bisa kusebut pulang.", author: "Hindia", source: "Rumah ke Rumah", language: "id", tags: ["jati-diri", "kesepian", "perjalanan"] },
  { text: "Usai sudah semua cerita, biarlah kini ku melangkah sendiri.", author: "Tiara Andini", source: "Usai", language: "id", tags: ["move-on", "penerimaan", "sendu"] },
  { text: "Pernah merasa indah, pernah merasa paling dicinta, sebelum akhirnya kau memilih pergi.", author: "Tiara Andini", source: "Merasa Indah", language: "id", tags: ["patah-hati", "nostalgia-trip", "kehilangan"] },
  { text: "Yang kau takutkan takkan terjadi, yang kau cemaskan akan mereda.", author: "Kunto Aji", source: "Rehat", language: "id", tags: ["anxiety", "baik-baik-saja", "self-care"] },
  { text: "Masih banyak yang belum sempat aku katakan padamu, namun pilu membiru kini menyelimuti.", author: "Kunto Aji", source: "Pilu Membiru", language: "id", tags: ["penyesalan", "kehilangan", "melankolis"] },
  { text: "Terlalu lama sendiri, sudah terlalu lama aku asyik dengan duniaku sendiri.", author: "Kunto Aji", source: "Terlalu Lama Sendiri", language: "id", tags: ["introvert", "sepi", "nyaman"] },
  { text: "Take me home, I'm falling. Love me long, I'm rolling.", author: "Pamungkas", source: "To The Bone", language: "en", tags: ["cinta", "romantis", "late-night-drive"] },
  { text: "Biar semua jadi kenangan manis, walau tak bisa lagi bersama.", author: "Pamungkas", source: "Kenangan Manis", language: "id", tags: ["nostalgia-trip", "penerimaan", "move-on"] },
  { text: "Kukira kita akan bersama, nyatanya kau di sana, aku di sini. Hati-hati di jalan.", author: "Tulus", source: "Hati-Hati di Jalan", language: "id", tags: ["patah-hati", "perpisahan", "relatable"] },
  { text: "Di mana pun kalian berada, ku kirimkan terima kasih untuk warna dalam hidupku.", author: "Tulus", source: "Monokrom", language: "id", tags: ["nostalgia-trip", "bersyukur", "hangat"] },
  { text: "Hari ini aku memaafkan diriku, hari ini aku memeluk diriku erat-erat.", author: "Tulus", source: "Diri", language: "id", tags: ["self-care", "self-love", "mental-health"] },
  { text: "Menangislah, tak apa jika kau lelah. Jiwa yang bersedih berhak untuk istirahat.", author: "Ghea Indrawari", source: "Jiwa Yang Bersedih", language: "id", tags: ["burnout", "izin-lemah", "capek"] },
  { text: "Dan bila esok datang kembali, seperti sedia kala, di mana kau bisa bercanda.", author: "Sheila On 7", source: "Dan", language: "id", tags: ["nostalgia-trip", "klasik", "melankolis"] },
  { text: "I'm drunk in the back of the car, and I cried like a baby coming home from the bar.", author: "Taylor Swift", source: "Cruel Summer", language: "en", tags: ["late-night-drive", "patah-hati", "overthinking"] },
  { text: "And you call me up again just to break me like a promise. So casually cruel in the name of being honest.", author: "Taylor Swift", source: "All Too Well", language: "en", tags: ["marah", "heartbreak-anthem", "sadar-diri"] },
  { text: "But I can see us lost in the memory, August slipped away into a moment in time 'cause it was never mine.", author: "Taylor Swift", source: "August", language: "en", tags: ["nostalgia-trip", "cinta-bertepuk-sebelah-tangan", "sendu"] },
  { text: "I think I've seen this film before, and I didn't like the ending.", author: "Taylor Swift", source: "Exile", language: "en", tags: ["red-flag", "sadar-diri", "patah-hati"] },
  { text: "I should've known it was strange, you only come out at night, I used to think I was smart.", author: "Olivia Rodrigo", source: "Vampire", language: "en", tags: ["penyesalan", "toxic", "marah"] },
  { text: "You didn't cheat, but you're still a traitor.", author: "Olivia Rodrigo", source: "Traitor", language: "en", tags: ["pengkhianatan", "patah-hati", "kesal"] },
  { text: "And I know we weren't perfect but I've never felt this way for no one.", author: "Olivia Rodrigo", source: "Drivers License", language: "en", tags: ["gagal-move-on", "late-night-drive", "sendu"] },
  { text: "I used to float, now I just fall down. I used to know but I'm not sure now.", author: "Billie Eilish", source: "What Was I Made For?", language: "en", tags: ["quarter-life-crisis", "lost", "jati-diri"] },
  { text: "When I'm away from you, I'm happier than ever. Wish I could explain it better.", author: "Billie Eilish", source: "Happier Than Ever", language: "en", tags: ["healing", "move-on", "toxic"] },
  { text: "I don't wanna talk right now, I just wanna watch TV. I'll stay in the pool and drown.", author: "Billie Eilish", source: "TV", language: "en", tags: ["burnout", "escapism", "introvert"] },
  { text: "I got that summertime, summertime sadness. S-s-summertime, summertime sadness.", author: "Lana Del Rey", source: "Summertime Sadness", language: "en", tags: ["melankolis", "aesthetic", "vibe"] },
  { text: "There's things I wanna say to you, but I'll just let you live.", author: "Lana Del Rey", source: "Cinnamon Girl", language: "en", tags: ["penerimaan", "pendam", "sepi"] },
  { text: "Will you still love me when I'm no longer young and beautiful?", author: "Lana Del Rey", source: "Young and Beautiful", language: "en", tags: ["insecure", "overthinking", "cinta"] },
  { text: "Why would you ever kiss me? I'm not even half as pretty.", author: "Conan Gray", source: "Heather", language: "en", tags: ["insecure", "cinta-bertepuk-sebelah-tangan", "sadar-diri"] },
  { text: "Please don't ruin this for me, please don't make it harder than it already is.", author: "Conan Gray", source: "Memories", language: "en", tags: ["move-on", "batas", "capek"] },
  { text: "Every day is summertime with you, every night I'm falling for you.", author: "NIKI", source: "Every Summertime", language: "en", tags: ["bucin", "romantis", "vibes"] },
  { text: "But if you take a chance with me, I could be the one you've been looking for.", author: "NIKI", source: "Take A Chance With Me", language: "en", tags: ["harapan", "cinta", "nekat"] },
  { text: "Oceans and engines, you're the one I'm missing. But I'll let you go, I'll let you go.", author: "NIKI", source: "Oceans & Engines", language: "en", tags: ["melepaskan", "patah-hati", "ikhlas"] },
  { text: "Cause sometimes I look in her eyes and that's where I find a glimpse of us.", author: "Joji", source: "Glimpse of Us", language: "en", tags: ["gagal-move-on", "toxic", "kenangan"] },
  { text: "Give me reasons we should be complete. You should be with him, I can't compete.", author: "Joji", source: "Slow Dancing in the Dark", language: "en", tags: ["insecure", "sadar-diri", "patah-hati"] },
  { text: "I might kill my ex, not the best idea. His new girlfriend's next, how'd I get here?", author: "SZA", source: "Kill Bill", language: "en", tags: ["toxic", "marah", "gagal-move-on"] },
  { text: "I can't lose when I'm with you. How can I snooze and miss the moment?", author: "SZA", source: "Snooze", language: "en", tags: ["bucin", "nyaman", "cinta"] },
  { text: "But I crumble completely when you cry. It seems like once again you've had to greet me with goodbye.", author: "Arctic Monkeys", source: "505", language: "en", tags: ["kelemahan", "perpisahan", "melankolis"] },
  { text: "I'm a creep, I'm a weirdo. What the hell am I doing here? I don't belong here.", author: "Radiohead", source: "Creep", language: "en", tags: ["outcast", "insecure", "quarter-life-crisis"] }
];

const dbPath = path.join(__dirname, '../data/quotes_draft.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let lastIdNum = 0;
if (db.length > 0) {
    const lastId = db[db.length - 1].id;
    lastIdNum = parseInt(lastId.replace('q', ''), 10);
}

quotes.forEach(q => {
    lastIdNum++;
    q.id = 'q' + lastIdNum.toString().padStart(3, '0');
    q.category = 'Lagu';
    q.length = q.text.length > 70 ? 'medium' : 'short';
    db.push(q);
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully added ${quotes.length} high-quality manual Lagu quotes.`);
console.log(`Total quotes now: ${db.length}`);
