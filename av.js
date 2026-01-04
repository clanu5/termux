// av.js - Av Botu Modülü (Resim ve Metin Kontrollü)

export function handleAv(text, groupId, senderId, commands, messageQueue, processQueue) {
    const sId = senderId.toString();

    // FISH (32060007)
    if (sId === "32060007" && (text.includes('fishing_bot/assets/refill/0/refill.png') || text.includes('إضافي لجميع أعضاء هذه'))) {
        console.warn(`[AV] Fish doldu: ${groupId}`);
        messageQueue.push({ groupId, command: commands.fish });
    } 
    // HUNT (76305584)
    else if (sId === "76305584" && text.includes('إضافي لجميع أعضاء هذه')) {
        console.warn(`[AV] Hunt doldu: ${groupId}`);
        messageQueue.push({ groupId, command: commands.hunt });
    } 
    // HEIST (39369782)
    else if (sId === "39369782" && text.includes('إضافي لجميع أعضاء هذه')) {
        console.warn(`[AV] Heist doldu: ${groupId}`);
        messageQueue.push({ groupId, command: commands.heist });
    } 
    // HERO (45578849)
    else if (sId === "45578849" && (text.includes('herosquad_bot/assets/unite/0/bg_groupUnite.jpg') || text.includes('إضافي لجميع أعضاء هذه'))) {
        console.warn(`[AV] Hero doldu: ${groupId}`);
        messageQueue.push({ groupId, command: commands.hero });
    }

    // Kuyruğu işlemeye başla
    processQueue();
}