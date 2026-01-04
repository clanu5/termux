import fetch from 'node-fetch';

let tabooData = []; 
let currentTabooHints = new Set();
let expectedWordCount = 0; 
let lastSentAnswer = ""; 

export async function loadTabooData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/clanu5/wo/refs/heads/main/tabu%20word.txt');
        const rawText = await response.text();
        const lines = rawText.split('\n');
        
        tabooData = [];
        lines.forEach(line => {
            const match = line.match(/\[(.*?)\]\s*=\s*\((.*?)\)/);
            if (match) {
                const word = match[1].trim().toLowerCase();
                const hints = match[2].split(',').map(h => h.trim().toLowerCase());
                tabooData.push({ word, hints, length: word.length });
            }
        });
        console.log(`✅ Tabu Veritabanı Hazır: ${tabooData.length} kelime.`);
    } catch (err) {
        console.error("❌ Veri çekme hatası.");
    }
}

export function handleTabu(text, groupId, senderId, targetGroupId, sendMessage) {
    if (groupId.toString() !== targetGroupId.toString() || senderId.toString() !== "24957563") return;

    const msg = text.toLowerCase().trim();

    // 1. OYUN BAŞLANGICI VE HAFIZA TEMİZLİĞİ
    // "Use the following hints to guess the answer (2 words)" formatını yakalar
    const startMatch = msg.match(/use the following hints/i) || msg.match(/harf sayısı:/i) || msg.match(/words\)/i);
    
    if (startMatch) {
        // Harf sayısını çek (Parantez içindeki sayıyı bul: (2 words))
        const countMatch = msg.match(/\((\d+)\s*words\)/i) || msg.match(/harf sayısı:\s*(\d+)/i);
        if (countMatch) {
            expectedWordCount = parseInt(countMatch[1]);
        }
        
        currentTabooHints.clear(); // ESKİ İPUÇLARINI SİL
        lastSentAnswer = "";
        console.log(`🎮 Yeni Oyun Tespit Edildi (${expectedWordCount} Harf). Hafıza sıfırlandı.`);

        // Eğer başlangıç mesajının içinde "Hint 1" de varsa onu hemen işle
        if (msg.includes('hint 1')) {
            processHint(text, groupId, sendMessage);
        }
        return;
    }

    // 2. İPUCU ALGILAMA (Gelen her Hint mesajı için)
    if (msg.includes('hint') || msg.includes('ipucu')) {
        processHint(text, groupId, sendMessage);
    }

    // 3. OYUN SONU VE YENİDEN BAŞLATMA (Failed / Time is up)
    // "The channel failed to guess" mesajı gelirse veya "Time is up!" gelirse
    if (msg.includes('time is up') || msg.includes('failed to guess') || msg.includes('channel failed')) {
        console.log("⌛ Oyun başarısız bitti. !tabum gönderiliyor...");
        currentTabooHints.clear();
        expectedWordCount = 0;
        
        setTimeout(() => {
            sendMessage(groupId, '!tabum');
        }, 3500); // Wolf botun spam uyarısı vermemesi için ideal süre
        return;
    }

    // 4. BAŞARI DURUMU (Kazanma)
    if (msg.includes('you have been awarded') || msg.includes('correct!')) {
        console.log("⭐ Tebrikler! Kelime bilindi. Hafıza temizlendi.");
        currentTabooHints.clear();
        expectedWordCount = 0;
        lastSentAnswer = "";
    }
}

// İpucu işleme fonksiyonu (Kod tekrarını önlemek için)
function processHint(text, groupId, sendMessage) {
    const parts = text.split(':');
    if (parts.length < 2) return;

    // Satır sonlarındaki süreyi (00:59 gibi) ve gereksizleri temizle
    const rawHint = parts[parts.length - 1].trim().split('\n')[0];
    const hint = rawHint.replace(/[0-9:]/g, '').trim().toLowerCase();

    if (hint && hint.length > 1) {
        currentTabooHints.add(hint);
        console.log(`🔍 Güncel İpuçları: ${Array.from(currentTabooHints).join(' + ')}`);

        const possibleMatches = tabooData.filter(item => {
            if (expectedWordCount > 0 && item.length !== expectedWordCount) return false;
            return Array.from(currentTabooHints).every(h => 
                item.hints.some(itemHint => itemHint.includes(h) || h.includes(itemHint))
            );
        });

        if (possibleMatches.length > 0) {
            const bestMatch = possibleMatches[0].word;
            if (bestMatch !== lastSentAnswer) {
                lastSentAnswer = bestMatch;
                setTimeout(() => {
                    sendMessage(groupId, bestMatch);
                }, 1300);
            }
        }
    }
}