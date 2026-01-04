// scramble.js - Scramble Çözücü Modülü
import fetch from 'node-fetch'; // Terminalde 'npm install node-fetch' yapmalısın

let wordList = [];

// Kelime listesini Github üzerinden çeker 
export async function loadWordList() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/clanu5/wo/refs/heads/main/sc.txt');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        wordList = text.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
        console.log(`✅ Scramble: ${wordList.length} kelime yüklendi!`);
    } catch (err) {
        console.error("❌ Wordlist yüklenemedi:", err.message);
    }
}

// Kelimeyi çözen ana mantık 
function solveScramble(scrambled) {
    if (!scrambled || scrambled.length < 3) return null;
    const firstChar = scrambled[0].toLowerCase();
    const lastChar = scrambled[scrambled.length - 1].toLowerCase();
    const middleChars = scrambled.slice(1, -1).toLowerCase().split('').sort().join('');

    return wordList.find(word => {
        if (word.length !== scrambled.length) return false;
        if (word[0] !== firstChar || word[word.length - 1] !== lastChar) return false;
        const middle = word.slice(1, -1).split('').sort().join('');
        return middle === middleChars;
    }) || null;
}

export function handleScramble(text, groupId, senderId, targetGroupId, sendMessage) {
    // Sadece hedef grupta ve 35920523 ID'li botun mesajlarında çalış [cite: 46]
    if (groupId.toString() === targetGroupId.toString() && senderId.toString() === "35920523") {
        const scrambleMatch = text.match(/\|\>\s*([a-zA-Z]+)\s*\<\|/);
        if (scrambleMatch) {
            const scrambled = scrambleMatch[1].toLowerCase();
            const solution = solveScramble(scrambled);

            if (solution) {
                console.log(`🎯 Scramble çözüldü: ${solution}`);
                setTimeout(() => {
                    sendMessage(groupId, solution);
                }, 1300); // Orijinal gecikme [cite: 46]
            } else {
                // Çözüm bulunamazsa yeni kelime iste [cite: 46]
                setTimeout(() => { sendMessage(groupId, "!scramble next"); }, 2000);
            }
        }
    }
}