// jockey.js - Jockey Tüm Varyantlar Modülü
let jockeyIntervals = [];

// --- 1: Oto Train (80277459 Özel) ---
export function startOtoTrain(minutes, customMessage, sendMessage) {
    const targetId = 80277459;
    // Kullanıcı mesaj girmediyse default: !j train all 10
    const message = customMessage || "!j train all 10";
    const ms = minutes * 60 * 1000;
    
    console.log(`🚀 [JOCKEY] Oto Train Başlatıldı. Hedef: ${targetId} | Mesaj: ${message} | Periyot: ${minutes} dk`);
    
    sendMessage(targetId, message, false); // false = Özel mesaj

    const interval = setInterval(() => {
        console.log(`⏰ [Oto Train] Özel mesaj gönderildi: ${message}`);
        sendMessage(targetId, message, false);
    }, ms);
    jockeyIntervals.push(interval);
}

// --- 2: Oto Yarış (Grup Mesajı) ---
export function startOtoYaris(groupId, minutes, sendMessage) {
    const message = "!j race";
    const ms = minutes * 60 * 1000;

    console.log(`🚀 [JOCKEY] Oto Yarış Başlatıldı. Grup: ${groupId} | Periyot: ${minutes} dk`);
    
    sendMessage(groupId, message, true); 

    const interval = setInterval(() => {
        console.log(`⏰ [Oto Yarış] !j race gönderildi.`);
        sendMessage(groupId, message, true);
    }, ms);
    jockeyIntervals.push(interval);
}

// jockey.js

// Botun meşgul olup olmadığını kontrol eden değişken
let isJockeyLocked = false; 

export function handleJockeyCheat(text, groupId, sendMessage) {
    // Eğer bot şu an bir geri sayım içindeyse (Locked), fonksiyonu direkt bitir
    if (isJockeyLocked) return;

    const msg = text.trim();
    const triggers = [
        "تم استخدام سباق قوي لهذا الميدان - المتبقي",
        "Energised Race consumed, the Channel"
    ];

    
    if (triggers.some(t => msg.includes(t))) {
        // KİLİDİ AKTİF ET: Diğer gruplar artık işlem yapamaz
        isJockeyLocked = true; 
        
        console.log(`🎯 [Cheat] Tetikleyici yakalandı! Grup: ${groupId}`);
        console.log(`🔒 Sistem Kilitlendi: 33.5 sn boyunca diğer gruplar dinlenmeyecek.`);

        setTimeout(() => {
            // Mesajı gönder
            sendMessage(groupId, "!j race", true);
            console.log(`🏁 [Cheat] !j race gönderildi.`);

            
            isJockeyLocked = false; 
            console.log(`🔓 Sistem Kilidi Açıldı: Yeni yarışlar bekleniyor...`);
            
        }, 33500);
    }
}
