// timing.js - Zamanlamalı 'now' Bot Modülü

/**
 * Mesajın içindeki saniyeyi bulur ve belirlenen gecikmeyle 'now' gönderir
 */
export function handleTiming(text, groupId, senderId, targetGroupId, delayMs, sendMessage) {
    // Sadece hedef grupta ve 26494626 ID'li botun {now} içeren mesajlarında çalış
    if (groupId.toString() === targetGroupId.toString() && 
        senderId.toString() === "26494626" && 
        text.includes('{now}')) {
        
        console.log(`[TIMING] {now} mesajı algılandı.`);

        // Sayıyı bul (Örn: {now} 15 seconds from now...)
        const delayMatch = text.match(/\{now\} (\d+) seconds/);
        
        if (delayMatch) {
            const secondsFromNow = parseInt(delayMatch[1]);
            // Toplam bekleme süresi: (Saniye * 1000) + Kullanıcının girdiği gecikme (ms)
            // Örn: Kullanıcı -120 girerse, saniyeden 120ms önce atar.
            const totalDelay = (secondsFromNow * 1000) + parseInt(delayMs);

            console.warn(`[TIMING] ${secondsFromNow} saniye sayıldı. ${delayMs}ms fark ile ayarlandı. Bekleniyor...`);

            setTimeout(() => {
                console.log(`[TIMING] 'now' gönderildi!`);
                sendMessage(groupId, 'now', true);
            }, totalDelay);
        }
    }
}