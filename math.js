// math.js - Matematik Çözücü Modülü

export function handleMath(text, groupId, senderId, sendMessage) {
    const msg = text.trim();
    const botId = "36828201"; // Matematik Botu ID

    // 1. SORU ÇÖZME MANTIĞI
    if (senderId.toString() === botId && msg.includes('Solve')) {
        let match = msg.match(/Solve:\s*(.*)/);
        
        if (match) {
            let operationText = match[1];
            
            // Temizlik ve Operatör Düzenleme
            operationText = operationText
                .replace(/[^\d()+\-*/.\s×]/g, '')
                .replace(/×/g, '*')
                .replace(/\s+/g, '');

            try {
                // İşlemi çöz
                const result = eval(operationText).toString();
                
                if (result) {
                    console.warn(`[MATH] Bot sorusu çözüldü: ${result}`);
                    
                    // 2 saniye gecikme ile cevabı gönder
                    setTimeout(() => {
                        sendMessage(groupId, result, true);
                    }, 2000); 
                }
            } catch (e) {
                console.error("[MATH] Hesaplama hatası:", e.message);
            }
        }
    }

    // 2. OYUN BİTTİĞİNDE YENİDEN BAŞLATMA MANTIĞI
    // "Time is up. Game over!" mesajı gelirse !math gönderir
    if (senderId.toString() === botId && msg.includes('Time is up. Game over!')) {
        console.log(`[MATH] Oyun süresi doldu. Yeni oyun başlatılıyor...`);
        
        // Wolf botun spam filtresine takılmamak için 3 saniye sonra !math gönder
        setTimeout(() => {
            sendMessage(groupId, "!math", true);
        }, 3000);
    }
}