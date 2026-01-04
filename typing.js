// typing.js - Typing Bot Modülü

let lastActionTimestamp = 0;

/**
 * Mesajı ayıklar ve belirlenen gecikmeyle gönderir [cite: 59-62]
 */
export function handleTyping(text, groupId, senderId, targetGroupId, sendMessage) {
    // Sadece hedef grupta, doğru bot ID'sinde (24062011) ve doğru formatta çalış 
    if (groupId.toString() === targetGroupId.toString() && 
        senderId.toString() === "24062011" && 
        text.includes('|-->')) {
        
        // Regex ile komutu çek: |--> KOMUT <--| [cite: 59]
        const match = text.match(/\|--> (.*) <--\|/);
        if (!match) return;

        const botCommand = match[1];
        const now = Date.now();
        const elapsedTime = now - lastActionTimestamp;
        const requiredWait = 500; // 0.5 saniye kuralı 

        // Son işlemden bu yana yeterli süre geçmişse 
        if (elapsedTime > requiredWait) {
            console.warn(`[TYPING] Komut algılandı: ${botCommand}`);
            
            // 1.2 saniye gecikme ile gönder [cite: 61]
            setTimeout(() => {
                sendMessage(groupId, botCommand);
                lastActionTimestamp = Date.now();
                console.log(`[TYPING] Gönderildi: ${botCommand}`);
            }, 1200);
        } else {
            // Eğer süre geçmemişse, kalan süreyi hesapla ve bekle [cite: 62]
            const remainingWait = requiredWait - elapsedTime + 1600;
            setTimeout(() => {
                sendMessage(groupId, botCommand);
                lastActionTimestamp = Date.now();
            }, remainingWait);
        }
    }
}