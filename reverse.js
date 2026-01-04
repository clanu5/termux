// reverse.js - 1BW Taktikli (Reverse) Modülü

let fishCount = 0; // Fish sayacı [cite: 49]

export function handleReverse(text, groupId, senderId, targetGroupId, sendMessage) {
    // Sadece hedef grupta ve 75423789 ID'li botun mesajlarında çalış [cite: 53]
    if (groupId.toString() === targetGroupId.toString() && senderId.toString() === "75423789" && text.includes('|-->')) {
        
        console.warn(`[1BW] Mesaj algılandı. Sayaç: ${fishCount}/10`);

        // Komutu ayıkla ve tersine çevir 
        const botCommand = text.replace(/\|--> (.*) <--\|/g, "$1");
        const reversedCommand = botCommand.split('').reverse().join('');

        if (fishCount >= 10) { // 10'a ulaştıysa 20 saniye bekle 
            fishCount = 0;
            console.warn('[1BW] 10 kez işlem yapıldı, 20 saniye bekleniyor...');
            setTimeout(() => {
                console.log(`[1BW] Bekleme bitti, gönderiliyor: ${reversedCommand}`);
                sendMessage(groupId, reversedCommand);
            }, 20000);
        } else {
            console.log(`[1BW] Tersine çevrildi: ${reversedCommand}`);
            // Anlık gönderim [cite: 56-57]
            setTimeout(() => {
                sendMessage(groupId, reversedCommand);
            }, 100);
        }

        fishCount++; // Sayacı artır [cite: 57]
    }
}