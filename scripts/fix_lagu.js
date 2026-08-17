const fs = require('fs');
const path = require('path');
const dbPath = '../data/quotes_draft.json';
let db = JSON.parse(fs.readFileSync(path.join(__dirname, dbPath), 'utf8'));

db = db.filter(q => q.category !== 'Lagu');

const exactQuotes = [
  { text: "Belum ada satu bulan, ku yakin masih ada sisa wangiku di bajumu. Namun kau tampak baik saja.", author: "Bernadya", source: "Satu Bulan", lang: "id" },
  { text: "Apa mungkin caraku bicara? Apa mungkin caraku tertawa? Atau mungkin kamu yang tak lagi cinta?", author: "Bernadya", source: "Apa Mungkin", lang: "id" },
  { text: "Kini mereka tahu kau tak sebaik itu, padahal dari dulu aku selalu...", author: "Bernadya", source: "Kini Mereka Tahu", lang: "id" },
  { text: "Memang tidak mudah mencintai diri ini. Namun aku tahu kau pasti bisa menerima.", author: "Nadin Amizah", source: "Rayuan Perempuan Gila", lang: "id" },
  { text: "Sebab kau dan aku tahu, jalan kita tak sama.", author: "Nadin Amizah", source: "Sorai", lang: "id" },
  { text: "Keras kepalaku sama denganmu. Caraku marah, caraku tersenyum, seperti detak jantung yang bertaut.", author: "Nadin Amizah", source: "Bertaut", lang: "id" },
  { text: "Lantas mengapa ku masih menaruh hati, padahal ku tahu kau t'lah terikat janji.", author: "Juicy Luicy", source: "Lantas", lang: "id" },
  { text: "Macam orang benar saja, kamu muncul dengan senyummu. Sialan, kusuka.", author: "Juicy Luicy", source: "Sialan", lang: "id" },
  { text: "Sial-sialnya ku bertemu dengan cinta semu. Tertipu tutur dan caramu seolah cintaiku.", author: "Mahalini", source: "Sial", lang: "id" },
  { text: "Tenggelam dalam kisah sempurna, yang nyatanya kini sebatas pernah.", author: "Mahalini", source: "Kisah Sempurna", lang: "id" },
  { text: "Bersedihlah secukupnya.", author: "Hindia", source: "Secukupnya", lang: "id" },
  { text: "Banyak hal yang tak bisa kau paksakan. Hari ini belum tentu lebih buruk dari kemarin.", author: "Hindia", source: "Evaluasi", lang: "id" },
  { text: "Tenangkan hati. Semua ini bukan salahmu. Jangan berhenti.", author: "Kunto Aji", source: "Rehat", lang: "id" },
  { text: "Masih banyak yang belum sempat aku katakan padamu.", author: "Kunto Aji", source: "Pilu Membiru", lang: "id" },
  { text: "Terlalu lama sendiri, sudah terlalu lama aku asyik dengan duniaku sendiri.", author: "Kunto Aji", source: "Terlalu Lama Sendiri", lang: "id" },
  { text: "Take me home, I'm fallin'. Love me long, I'm rollin'.", author: "Pamungkas", source: "To The Bone", lang: "en" },
  { text: "Tuk sementara, sampai berjumpa. Bersama-sama, bercanda tawa.", author: "Pamungkas", source: "Kenangan Manis", lang: "id" },
  { text: "Kukira kita akan bersama. Begitu banyak yang sama. Latarmu dan latarku.", author: "Tulus", source: "Hati-Hati di Jalan", lang: "id" },
  { text: "Di mana pun kalian berada, ku kirimkan terima kasih.", author: "Tulus", source: "Monokrom", lang: "id" },
  { text: "Maafkan semua yang lalu, ampuni hati kecilmu.", author: "Tulus", source: "Diri", lang: "id" },
  { text: "Menangislah, kan kau juga manusia. Mana ada yang bisa berlarut-larut pura-pura bahagia.", author: "Ghea Indrawari", source: "Jiwa Yang Bersedih", lang: "id" },
  { text: "Dan bila esok datang kembali, seperti sedia kala, di mana kau bisa bercanda.", author: "Sheila On 7", source: "Dan", lang: "id" },
  { text: "I'm drunk in the back of the car, and I cried like a baby coming home from the bar.", author: "Taylor Swift", source: "Cruel Summer", lang: "en" },
  { text: "And you call me up again just to break me like a promise. So casually cruel in the name of being honest.", author: "Taylor Swift", source: "All Too Well", lang: "en" },
  { text: "But I can see us lost in the memory, August slipped away into a moment in time 'cause it was never mine.", author: "Taylor Swift", source: "August", lang: "en" },
  { text: "I think I've seen this film before, and I didn't like the ending.", author: "Taylor Swift", source: "Exile", lang: "en" },
  { text: "I should've known it was strange, you only come out at night. I used to think I was smart.", author: "Olivia Rodrigo", source: "Vampire", lang: "en" },
  { text: "You didn't cheat, but you're still a traitor.", author: "Olivia Rodrigo", source: "Traitor", lang: "en" },
  { text: "And I know we weren't perfect but I've never felt this way for no one.", author: "Olivia Rodrigo", source: "Drivers License", lang: "en" },
  { text: "I used to float, now I just fall down. I used to know but I'm not sure now.", author: "Billie Eilish", source: "What Was I Made For?", lang: "en" },
  { text: "When I'm away from you, I'm happier than ever. Wish I could explain it better.", author: "Billie Eilish", source: "Happier Than Ever", lang: "en" },
  { text: "I don't wanna talk right now, I just wanna watch TV. I'll stay in the pool and drown.", author: "Billie Eilish", source: "TV", lang: "en" },
  { text: "I got that summertime, summertime sadness. S-s-summertime, summertime sadness.", author: "Lana Del Rey", source: "Summertime Sadness", lang: "en" },
  { text: "There's things I wanna say to you, but I'll just let you live.", author: "Lana Del Rey", source: "Cinnamon Girl", lang: "en" },
  { text: "Will you still love me when I'm no longer young and beautiful?", author: "Lana Del Rey", source: "Young and Beautiful", lang: "en" },
  { text: "Why would you ever kiss me? I'm not even half as pretty.", author: "Conan Gray", source: "Heather", lang: "en" },
  { text: "Please don't ruin this for me, please don't make it harder than it already is.", author: "Conan Gray", source: "Memories", lang: "en" },
  { text: "Every day is summertime with you, every night I'm falling for you.", author: "NIKI", source: "Every Summertime", lang: "en" },
  { text: "But if you take a chance with me, I could be the one you've been looking for.", author: "NIKI", source: "Take A Chance With Me", lang: "en" },
  { text: "Oceans and engines, you're the one I'm missing. But I'll let you go, I'll let you go.", author: "NIKI", source: "Oceans & Engines", lang: "en" },
  { text: "Cause sometimes I look in her eyes and that's where I find a glimpse of us.", author: "Joji", source: "Glimpse of Us", lang: "en" },
  { text: "Give me reasons we should be complete. You should be with him, I can't compete.", author: "Joji", source: "Slow Dancing in the Dark", lang: "en" },
  { text: "I might kill my ex, not the best idea. His new girlfriend's next, how'd I get here?", author: "SZA", source: "Kill Bill", lang: "en" },
  { text: "I can't lose when I'm with you. How can I snooze and miss the moment?", author: "SZA", source: "Snooze", lang: "en" },
  { text: "But I crumble completely when you cry. It seems like once again you've had to greet me with goodbye.", author: "Arctic Monkeys", source: "505", lang: "en" },
  { text: "I'm a creep, I'm a weirdo. What the hell am I doing here? I don't belong here.", author: "Radiohead", source: "Creep", lang: "en" },
  { text: "Cause it's too cold for you here, and now so let me hold both your hands in the holes of my sweater.", author: "The Neighbourhood", source: "Sweater Weather", lang: "en" },
  { text: "I'm not the only one. You say I'm crazy, 'cause you don't think I know what you've done.", author: "Sam Smith", source: "I'm Not The Only One", lang: "en" },
  { text: "Cause all of me loves all of you. Love your curves and all your edges, all your perfect imperfections.", author: "John Legend", source: "All of Me", lang: "en" },
  { text: "Somebody that I used to know. Now and then I think of all the times you screwed me over.", author: "Gotye", source: "Somebody That I Used To Know", lang: "en" }
];

let lastIdNum = 415;

exactQuotes.forEach(q => {
  lastIdNum++;
  db.push({
    id: 'q' + lastIdNum.toString().padStart(3, '0'),
    text: q.text,
    author: q.author,
    source: q.source,
    category: "Lagu",
    language: q.lang,
    length: q.text.length > 70 ? "medium" : "short",
    tags: ["melankolis", "relatable", "patah-hati"]
  });
});

fs.writeFileSync(path.join(__dirname, dbPath), JSON.stringify(db, null, 2), 'utf8');
console.log('Fixed Lagu quotes.');
