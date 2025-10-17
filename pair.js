
const express = require('express');
const fs = require('fs-extra');
const { exec } = require("child_process");
const router = express.Router();
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const crypto = require('crypto');

const MESSAGE = process.env.MESSAGE || `
> ▬▬ι══════════════ι▬▬
    𓊈 𝐀𝐒𝐊 𝐂𝐑𝐀𝐒𝐇𝐄𝐑 𝐕.1.00 𓊉
> ▬▬ι══════════════ι▬▬

> █▒▒▒▒▒▒▒██▒▒▒▒▒▒▒█
> ▒ 𝐂𝐑𝐄𝐀𝐓𝐄 𝐁𝐘 𝐃𝐄𝐕 𝐀𝐒𝐊
> ▒ 𝐒𝐂𝐑𝐈𝐏𝐓 𝐁𝐎𝐓 𝐖𝐄𝐁 
> ▒ 𝐅𝐑𝐄𝐄 𝐁𝐔𝐆 𝐁𝐎𝐓
> ▒ 𝐁𝐀𝐘 𝐒𝐂𝐑𝐈𝐏𝐓 𝐎𝐍 𝐏𝐀𝐘𝐏𝐀𝐋 *5$*
> █▒▒▒▒▒▒▒██▒▒▒▒▒▒▒█

> 𝐒𝐞𝐮𝐥𝐞 50 𝐏𝐞𝐫𝐬𝐨𝐧𝐧𝐞 𝐏𝐞𝐮𝐯𝐞𝐧𝐭 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞 𝐋𝐞 𝐁𝐨𝐭
> 𝐏𝐨𝐮𝐫 𝐀𝐯𝐨𝐢𝐫 𝐋𝐞 𝐁𝐨𝐭 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐂𝐨𝐧𝐭𝐚𝐜𝐭𝐞 𝐋𝐞 𝐃𝐞𝐯
> 𝐎𝐮 𝐑𝐞𝐠𝐚𝐫𝐝𝐞 20 𝐏𝐮𝐛𝐥𝐢𝐜𝐢𝐭𝐞 𝐃𝐞 5𝐬 ..!!

【 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 】— *Contacte Le Développeur.*
> *+24165726941*
> *+24177474264*
> *+224620769837*
> 𝐃𝐄𝐕 𝐌𝐄𝐒𝐒𝐘 𝐀𝐒𝐊 𝐓𝐄𝐂𝐇 🙃🙈
> 𝐌𝐑 𝐏𝐑𝐎𝐁𝐋𝐄𝐌𝐀𝐓𝐈𝐐𝐔𝐄 𝐃𝐄𝐕 🙈💥
`;

const { upload } = require('./mega');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason
} = require("@whiskeysockets/baileys");

// Clear auth directory at startup
if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync('./auth_info_baileys');
}

router.get('/', async (req, res) => {
    let num = req.query.number;

    async function SUHAIL() {
        const { state, saveCreds } = await useMultiFileAuthState(`./auth_info_baileys`);

        try {
            const Smd = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!Smd.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Smd.requestPairingCode(num);
                if (!res.headersSent) await res.send({ code });
            }

            Smd.ev.on('creds.update', saveCreds);

            Smd.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === "open") {  
                    try {
                        await delay(10000);

                        const auth_path = './auth_info_baileys/';
                        const user = Smd.user.id;

                        // Random Mega ID generator
                        function randomMegaId(length = 6, numberLength = 4) {
                            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                            let result = '';
                            for (let i = 0; i < length; i++) {
                                result += characters.charAt(Math.floor(Math.random() * characters.length));
                            }
                            const number = Math.floor(Math.random() * Math.pow(10, numberLength));
                            return `${result}${number}`;
                        }

                        // Upload creds.json to Mega
                        const mega_url = await upload(fs.createReadStream(auth_path + 'creds.json'), `${randomMegaId()}.json`);

                        // Extraire fileID et key en toute sécurité
                        let fileID, key;
                        if (mega_url.includes('#')) {
                            const parts = mega_url.split('/file/')[1].split('#');
                            fileID = parts[0];
                            key = parts[1];
                        } else {
                            fileID = mega_url.split('/file/')[1];
                            key = crypto.randomBytes(32).toString('base64'); // fallback
                        }

                        // Construire la session avec préfixe kaya~
                        const sessionString = `ASK-CRASHER-V1~${fileID}#${key}`;

                        // Envoyer la session à l’utilisateur
                        const msgsss = await Smd.sendMessage(user, { text: sessionString });
                  
await Smd.sendMessage(user, { 
  image: { 
    url: "https://files.catbox.moe/zq1kuc.jpg" 
  }, 
  caption: MESSAGE,
  contextInfo: {
    mentionedJid: [user],
    forwardedNewsletterMessageInfo: {
      newsletterName: "𝐀𝐒𝐊 𝐓𝐄𝐂𝐇 || 𝐎𝐅𝐅𝐂",
      newsletterJid: `120363330359618597@newsletter`
    },
    isForwarded: true,
    externalAdReply: {
      showAdAttribution: true,
      title: `𝙳𝙴𝚅 𝙰𝚂𝙺 𝚃𝙴𝙲𝙷`,
      mediaType: 3,
      renderLargerThumbnail: false,
      thumbnailUrl: '', // vide pour ne pas afficher d'image
      sourceUrl: `https://whatsapp.com/channel/0029VaiPkRPLY6d0qEX50e2k`
    }
  }
}, { quoted: msgsss });
                        await delay(1000);
                        await fs.emptyDir(auth_path);

                    } catch (e) {
                        console.log("Error during upload or send:", e);
                    }
                }

                if (connection === "close") {
                    const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    if ([DisconnectReason.connectionClosed, DisconnectReason.connectionLost, DisconnectReason.restartRequired, DisconnectReason.timedOut].includes(reason)) {
                        console.log("Reconnecting...");
                        SUHAIL().catch(console.log);
                    } else {
                        console.log('Connection closed unexpectedly:', reason);
                        await delay(5000);
                        exec('pm2 restart qasim');
                    }
                }
            });

        } catch (err) {
            console.log("Error in SUHAIL function:", err);
            exec('pm2 restart qasim');
            SUHAIL();
            await fs.emptyDir('./auth_info_baileys');
            if (!res.headersSent) await res.send({ code: "Try After Few Minutes" });
        }
    }

    await SUHAIL();
});

module.exports = router;
