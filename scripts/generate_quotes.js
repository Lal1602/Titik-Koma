const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/EXPO_PUBLIC_GEMINI_API_KEY=(.*)/);
if (!match) throw new Error("API Key not found in .env");
const API_KEY = match[1].trim();

const targetCategory = process.argv[2];
const BATCH_SIZE = 25; // 25 quotes per request
const TOTAL_NEEDED = 100;
const CALLS = TOTAL_NEEDED / BATCH_SIZE;

const dbPath = path.join(__dirname, '../data/quotes_draft.json');
let promptPath = path.join(__dirname, '../briefings/superprompt_tambah_600_quotes.md');
if (targetCategory === 'Lagu') {
  promptPath = path.join(__dirname, '../briefings/superprompt_lagu_khusus.md');
}
const superprompt = fs.readFileSync(promptPath, 'utf8');

function callGemini(promptText) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let result = '';
      res.on('data', (d) => { result += d; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(result);
          if (parsed.error) return reject(parsed.error);
          const text = parsed.candidates[0].content.parts[0].text;
          const jsonArray = JSON.parse(text);
          resolve(jsonArray);
        } catch (e) {
          console.error("Parse Error. Raw Response:", result.substring(0, 500) + '...');
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function run() {
  if (!targetCategory) {
    console.error("Please provide a category: Sastra, Film, Lagu, Relatable, 'IG Notes'");
    process.exit(1);
  }
  
  console.log(`Generating quotes for category: ${targetCategory}. Target total: ${TOTAL_NEEDED}`);
  
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  let currentCategoryCount = db.filter(q => q.category === targetCategory).length;
  console.log(`Current ${targetCategory} count in DB: ${currentCategoryCount}`);
  
  if (currentCategoryCount >= TOTAL_NEEDED) {
    console.log(`Target reached for ${targetCategory}. Exiting.`);
    return;
  }
  
  let remainingNeeded = TOTAL_NEEDED - currentCategoryCount;
  let callsNeeded = Math.ceil(remainingNeeded / BATCH_SIZE);
  
  for (let i = 0; i < callsNeeded; i++) {
    console.log(`Calling Gemini... Part ${i+1}/${callsNeeded}`);
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8')); // reload to get latest state
    let lastIdNum = parseInt(db[db.length - 1].id.replace('q', ''), 10);
    
    // Check if we actually need more
    currentCategoryCount = db.filter(q => q.category === targetCategory).length;
    if (currentCategoryCount >= TOTAL_NEEDED) break;
    
    let fetchSize = Math.min(BATCH_SIZE, TOTAL_NEEDED - currentCategoryCount);
    
    const promptText = `${superprompt}

TUGASMU SEKARANG:
Hasilkan array berisi tepat ${fetchSize} quotes untuk kategori: **${targetCategory}**.
Pastikan ID dimulai dari q${(lastIdNum + 1).toString().padStart(3, '0')}.
Patuhi semua aturan di atas, terutama batas panjang karakter (length) dan pemilihan bahasa!
Untuk Sastra/Film/Lagu, variasikan penulis/karakter sesuai daftar sumber di atas.
`;

    let success = false;
    let retries = 10;
    while (!success && retries > 0) {
      try {
        const newQuotes = await callGemini(promptText);
        console.log(`Received ${newQuotes.length} quotes.`);
        
        let added = 0;
        newQuotes.forEach(q => {
          if (!q.text || !q.author) return;
          lastIdNum++;
          q.id = 'q' + lastIdNum.toString().padStart(3, '0');
          q.category = targetCategory; // force category override to be safe
          db.push(q);
          added++;
        });
        
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log(`Successfully appended ${added} quotes to DB.`);
        
        // Sleep to respect rate limits
        await new Promise(r => setTimeout(r, 6000));
        success = true;
      } catch (e) {
        retries--;
        const errMsg = e.message || String(e);
        console.error(`Failed on iteration ${i}. Retries left: ${retries}.`);
        console.error(`Error:`, errMsg);
        
        if (retries === 0) {
          console.error("Out of retries, stopping script.");
          process.exit(1);
        }
        
        let waitTime = 30000; // default 30s
        const match = errMsg.match(/retry in ([\d\.]+)s/);
        if (match) {
          waitTime = Math.ceil(parseFloat(match[1]) * 1000) + 2000; // add 2s buffer
        }
        
        console.log(`Waiting ${waitTime / 1000} seconds before retrying to respect API rate limits...`);
        await new Promise(r => setTimeout(r, waitTime));
      }
    }
  }
}

run();
