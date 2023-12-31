const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./stickers')
const { default: _makeWaSocket, makeWALegacySocket, WAMessageStubType, getContentType, relayMessage, areJidsSameUser, generateWAMessage, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, getAggregateVotesInPollMessage, proto, extractMessageContent } = require("@whiskeysockets/baileys")
const chalk = require('chalk')
const fs = require('fs')
const child_process = require('child_process')
const ffmpeg = require('fluent-ffmpeg')
const Crypto = require('crypto')
const axios = require('axios')
const pino = require('pino')
const fetch = require('node-fetch')
const moment = require('moment-timezone')
const { sizeFormatter } = require('human-readable')
const util = require('util')
const jimp = require('jimp')
const { defaultMaxListeners } = require('stream')
const FileType = require("file-type")
const path = require("path")
const store = require('./store.js')
const PhoneNumber = require('awesome-phonenumber')
function makeWaSocket(connectionOptions, options = {}) { // CRÉDITOS @SKIDY89 ANTI MARIO.JS
/**
* @type {import('@whiskeysockets/baileys').WASocket | import('@whiskeysockets/baileys').WALegacySocket}
*/
const conn = (global.opts['legacy'] ? makeWALegacySocket : _makeWaSocket)(connectionOptions)
const sock = Object.defineProperties(conn, {
    chats: {
      value: {...(options.chats || {})},
      writable: true,
    },
    decodeJid: {
    value(jid) {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
    let decode = jidDecode(jid) || {}
    return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
    },
    },
    logger: {
      get() {
        return {
          info(...args) {
            console.log(
                chalk.bold.bgRgb(51, 204, 51)('INFO '),
                `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                chalk.cyan(format(...args)),
            );
          },
          error(...args) {
            console.log(
                chalk.bold.bgRgb(247, 38, 33)('ERROR '),
                `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                chalk.rgb(255, 38, 0)(format(...args)),
            );
          },
          warn(...args) {
            console.log(
                chalk.bold.bgRgb(255, 153, 0)('WARNING '),
                `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                chalk.redBright(format(...args)),
            );
          },
          trace(...args) {
            console.log(
                chalk.grey('TRACE '),
                `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                chalk.white(format(...args)),
            );
          },
          debug(...args) {
            console.log(
                chalk.bold.bgRgb(66, 167, 245)('DEBUG '),
                `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                chalk.white(format(...args)),
            );
          },
        }
      },
      enumerable: true
      },
    appenTextMessage: {
      async value(m, text, chatUpdate) {
        let messages = await generateWAMessage(
          m.chat,
          { text: text, mentions: m.mentionedJid },
          {
            userJid: this.user.id,
            quoted: m.quoted && m.quoted.fakeObj,
          }
        );
        messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
        messages.key.id = m.key.id;
        messages.pushName = m.pushName;
        if (m.isGroup) messages.participant = m.sender;
        let msg = {
          ...chatUpdate,
          messages: [proto.WebMessageInfo.fromObject(messages)],
          type: "append",
        };
        this.ev.emit("messages.upsert", msg);
      },
    },
    getFile: {
    async value(PATH, saveToFile = false) {
     let res; let filename; 
         const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0); 
         if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer'); 
         const type = await FileType.fromBuffer(data) || { 
           mime: 'application/octet-stream', 
           ext: '.bin', 
         }; 
         if (data && saveToFile && !filename) (filename = path.join(__dirname, '../temp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data)); 
         return { 
           res, 
           filename, 
           ...type, 
           data, 
           deleteFile() { 
             return filename && fs.promises.unlink(filename); 
           }, 
           }
           },
           enumerable: true
    },
    sendPoll: {
    value(jid, name = '', values = [], selectableCount = 1) {
    return this.sendMessage(jid, { poll: { name, values, selectableCount }})
    },
    },
    fakeReply: {
    value(jid, caption,  fakeNumber, fakeCaption) {
    this.sendMessage(jid, { text: caption }, {quoted: { key: { fromMe: false, participant: fakeNumber, ...(jid ? { remoteJid: null } : {}) }, message: { conversation: fakeCaption }}})
    },
    },
    downloadAndSaveMediaMessage: {
    async value(message, filename, attachExtension = true) {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])}
    let type = await FileType.fromBuffer(buffer)
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
    },
    enumerable: true
    },
    sendFile: {
    async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
    const type = await this.getFile(path, true); 
         let {res, data: file, filename: pathFile} = type; 
         if (res && res.status !== 200 || file.length <= 65536) { 
           try { 
             throw {json: JSON.parse(file.toString())}; 
           } catch (e) { 
             if (e.json) throw e.json; 
           } 
         }      
         const opt = {}; 
         if (quoted) opt.quoted = quoted; 
         if (!type) options.asDocument = true; 
         let mtype = ''; let mimetype = options.mimetype || type.mime; let convert; 
         if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'; 
         else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'; 
         else if (/video/.test(type.mime)) mtype = 'video'; 
         else if (/audio/.test(type.mime)) { 
           ( 
             convert = await toAudio(file, type.ext), 
             file = convert.data, 
             pathFile = convert.filename, 
             mtype = 'audio', 
             mimetype = options.mimetype || 'audio/mpeg; codecs=opus' 
           ); 
         } else mtype = 'document'; 
         if (options.asDocument) mtype = 'document'; 
  
         delete options.asSticker; 
         delete options.asLocation; 
         delete options.asVideo; 
         delete options.asDocument; 
         delete options.asImage; 
  
         const message = { 
           ...options, 
           caption, 
           ptt, 
           [mtype]: {url: pathFile}, 
           mimetype, 
           fileName: filename || pathFile.split('/').pop(), 
         }; 
         /** 
                  * @type {import('@whiskeysockets/baileys').proto.WebMessageInfo} 
                  */ 
         let m; 
         try { 
           m = await this.sendMessage(jid, message, {...opt, ...options}); 
         } catch (e) { 
           console.error(e); 
           m = null; 
         } finally { 
           if (!m) m = await this.sendMessage(jid, {...message, [mtype]: file}, {...opt, ...options}); 
           file = null; // releasing the memory 
           return m; 
         } 
    },
    enumerable: true
    },
    getName: {
    async value(jid = '', withoutContact = false) {
    jid = this.decodeJid(jid);
        withoutContact = this.withoutContact || withoutContact;
        let v;
        if (jid.endsWith('@g.us')) {
          return new Promise(async (resolve) => {
            v = this.chats[jid] || {};
            if (!(v.name || v.subject)) v = await this.groupMetadata(jid) || {};
            resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'));
          });
        } else {
          v = jid === '0@s.whatsapp.net' ? {
            jid,
            vname: 'WhatsApp',
          } : areJidsSameUser(jid, this.user.id) ?
                    this.user :
                    (this.chats[jid] || {});
        }
        return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
      },
      enumerable: true,
      },
      sendVideoAsSticker: {
      async value(jid, path, quoted, options = {}) {
      let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await this.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    },
    },
    downloadMediaMessage: {
    async value(message) {
    let mime = (message.msg || message).mimetype || ''
        let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0]
        let extension = mime.split('/')[1]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    },
    },
    downloadM: {
      /**
             * Download media message
             * @param {Object} m
             * @param {String} type
             * @param {fs.PathLike | fs.promises.FileHandle} saveToFile
             * @return {Promise<fs.PathLike | fs.promises.FileHandle | Buffer>}
             */
      async value(m, type, saveToFile) {
        let filename;
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0);
        const stream = await downloadContentFromMessage(m, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        if (saveToFile) ({filename} = await this.getFile(buffer, true));
        return saveToFile && fs.existsSync(filename) ? filename : buffer;
      },
      enumerable: true,
    },
    sendTextWithMentions: {
    async value(jid, text, quoted, options = {}) {
    this.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
    },
    },
    sendText: {
    async value(jid, text, quoted = '', options) {
    this.sendMessage(jid, { text: text, ...options }, { quoted })
    },
    },
    parseAudio: {
    async value(jid, audio, quoted, ppt, name, link, image) {
    await this.sendPresenceUpdate('recording', jid)
    await this.sendMessage(jid, { audio: { url: audio }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: ppt ? ptt : true, contextInfo:{  externalAdReply: { showAdAttribution: true,
    mediaType:  1,
    mediaUrl: link ? link : 'https://github.com/Skidy89',
    title: name ? name : global.botname,
    sourceUrl: link ? link : `https://github.com/Skidy89`, 
    thumbnail: image ? image : global.success
    }}}, { quoted: quoted ? quoted : m })
    },
    },
    sendImageAsSticker: {
    async value(jid, path, quoted, options = {}) {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await this.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    return buffer
    },
    },
    reply: {
    value(jid, text = '', quoted, options) {
        return Buffer.isBuffer(text) ? this.sendFile(jid, text, 'file', '', quoted, false, options) : this.sendMessage(jid, {...options, text}, {quoted, ...options});
      },
    },
    parseMention: {
    value(text = '') {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    },
    enumerable: true,
    },
    sendNyanCat: {
      async value(jid, text = '', buffer, title, body, url, quoted, options) {
        if (buffer) {
          try {
            (type = await this.getFile(buffer), buffer = type.data);
          } catch {
            buffer = buffer;
          }
        }
	     const prep = generateWAMessageFromContent(jid, {extendedTextMessage: {text: text, contextInfo: {externalAdReply: {title: title, body: body, thumbnail: buffer, sourceUrl: url}, mentionedJid: await this.parseMention(text)}}}, {quoted: quoted});
        return this.relayMessage(jid, prep.message, {messageId: prep.key.id});
      },
    },
    pushMessage: {
      /**
             * pushMessage
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo[]} m
             */
      async value(m) {
        if (!m) return;
        if (!Array.isArray(m)) m = [m];
        for (const message of m) {
          try {
            // if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
            if (!message) continue;
            if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) this.processMessageStubType(message).catch(console.error);
            const _mtype = Object.keys(message.message || {});
            const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
                            (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
                            _mtype[_mtype.length - 1];
            const chat = this.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '');
            if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
              /**
                             * @type {import('@whiskeysockets/baileys').proto.IContextInfo}
                             */
              const context = message.message[mtype].contextInfo;
              let participant = this.decodeJid(context.participant);
              const remoteJid = this.decodeJid(context.remoteJid || participant);
              /**
                             * @type {import('@whiskeysockets/baileys').proto.IMessage}
                             *
                             */
              const quoted = message.message[mtype].contextInfo.quotedMessage;
              if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
                let qMtype = Object.keys(quoted)[0];
                if (qMtype == 'conversation') {
                  quoted.extendedTextMessage = {text: quoted[qMtype]};
                  delete quoted.conversation;
                  qMtype = 'extendedTextMessage';
                }
                if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {};
                quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || [];
                const isGroup = remoteJid.endsWith('g.us');
                if (isGroup && !participant) participant = remoteJid;
                const qM = {
                  key: {
                    remoteJid,
                    fromMe: areJidsSameUser(this.user.jid, remoteJid),
                    id: context.stanzaId,
                    participant,
                  },
                  message: JSON.parse(JSON.stringify(quoted)),
                  ...(isGroup ? {participant} : {}),
                };
                let qChats = this.chats[participant];
                if (!qChats) qChats = this.chats[participant] = {id: participant, isChats: !isGroup};
                if (!qChats.messages) qChats.messages = {};
                if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM;
                let qChatsMessages;
                if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)); // maybe avoid memory leak
              }
            }
            if (!chat || chat === 'status@broadcast') continue;
            const isGroup = chat.endsWith('@g.us');
            let chats = this.chats[chat];
            if (!chats) {
              if (isGroup) await this.insertAllGroup().catch(console.error);
              chats = this.chats[chat] = {id: chat, isChats: true, ...(this.chats[chat] || {})};
            }
            let metadata; let sender;
            if (isGroup) {
              if (!chats.subject || !chats.metadata) {
                metadata = await this.groupMetadata(chat).catch((_) => ({})) || {};
                if (!chats.subject) chats.subject = metadata.subject || '';
                if (!chats.metadata) chats.metadata = metadata;
              }
              sender = this.decodeJid(message.key?.fromMe && this.user.id || message.participant || message.key?.participant || chat || '');
              if (sender !== chat) {
                let chats = this.chats[sender];
                if (!chats) chats = this.chats[sender] = {id: sender};
                if (!chats.name) chats.name = message.pushName || chats.name || '';
              }
            } else if (!chats.name) chats.name = message.pushName || chats.name || '';
            if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue;
            chats.isChats = true;
            if (!chats.messages) chats.messages = {};
            const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, this.user.id);
            if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
              delete message.message.messageContextInfo;
              delete message.message.senderKeyDistributionMessage;
              chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2));
              let chatsMessages;
              if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length));
            }
          } catch (e) {
            console.error(e);
          }
        }
      },
    },
    sendPayment: {
    async value(jid, amount, text, quoted, options) {
    this.relayMessage(jid, { 
           requestPaymentMessage: { 
             currencyCodeIso4217: 'PEN', 
             amount1000: amount, 
             requestFrom: null, 
             noteMessage: { 
               extendedTextMessage: { 
                 text: text, 
                 contextInfo: { 
                   externalAdReply: { 
                     showAdAttribution: true, 
                   }, mentionedJid: this.parseMention(text)}}}}}, {})
    },
    },
    loadMessage: {
      /**
             *
             * @param {String} messageID
             * @returns {import('@whiskeysockets/baileys').proto.WebMessageInfo}
             */
      value(messageID) {
        return Object.entries(this.chats)
            .filter(([_, {messages}]) => typeof messages === 'object')
            .find(([_, {messages}]) => Object.entries(messages)
                .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
            ?.[1].messages?.[messageID];
      },
      enumerable: true,
    },
    sendImage: {
    async value(jid, path, caption = '', quoted = '', options) {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0) 
    return await this.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted }) 
    },
    },
    adReply: {
    value(jid, caption, thumbnail, quoted, inTrue) {
    this.sendMessage(jid ? jid : this.chat, {   
    text: caption,  
    contextInfo:{  
    forwardingScore: 9999999,  
    isForwarded: true,   
    mentionedJid:[this.sender],  
    "externalAdReply": {  
    "showAdAttribution": true,  
    "containsAutoReply": true,
    "renderLargerThumbnail": inTrue ? inTrue : false,  
    "title": botname,   
    "containsAutoReply": false,  
    "mediaType": 1,   
    "thumbnail": thumbnail ? thumbnail : global.menu,  
    "mediaUrl": `https://chat.whatsapp.com/JPJ0n2V0uujCRvmJRNM7ZU`,  
    "sourceUrl": `https://chat.whatsapp.com/JPJ0n2V0uujCRvmJRNM7ZU`  
    }
    }  
    }, { quoted: quoted ? quoted : null })
    },
    },
    editMessage: {
    async value(jid, text, editedText, seconds, quoted) {
    const {key} = await this.sendMessage(jid, { text: text }, { quoted: quoted })
     await delay(1000 * seconds); // message in seconds?? (delay)
     await this.sendMessage(jid, { text: editedText, edit: key })
     },
     },
     sendAudio: {
     async value(jid, audio, quoted, ppt, options) {
     await this.sendPresenceUpdate('recording', jid)
     await this.sendMessage(jid, { audio: { url: audio }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: ppt ? ptt : true, ...options }, { quoted: quoted })
     },
     },
     sendCart: {
     async value(jid, text, thumbail, orderTitle, userJid) {
     var messa = await prepareWAMessageMedia({ image: thumbail ? thumbail : success }, { upload: this.waUploadToServer })
     var order = generateWAMessageFromContent(jid, proto.Message.fromObject({
     "orderMessage":{ "orderId":"3648563358700955",
     "thumbnail": thumbail ? thumbail : success,
     "itemCount": 999999,
     "status": "INQUIRY",
     "surface": "CATALOG",
     "message": text,
     "orderTitle": orderTitle ? orderTitle : 'unknown',
     "sellerJid": "5218442114446@s.whatsapp.net",
     "token": "AR4flJ+gzJw9zdUj+RpekLK8gqSiyei/OVDUFQRcmFmqqQ==",
     "totalAmount1000": "-500000000",
     "totalCurrencyCode":"USD",
     "contextInfo":{ "expiration": 604800, "ephemeralSettingTimestamp":"1679959486","entryPointConversionSource":"global_search_new_chat","entryPointConversionApp":"whatsapp","entryPointConversionDelaySeconds":9,"disappearingMode":{"initiator":"CHANGED_IN_CHAT"}}}
     }), { userJid: userJid ? userJid : this.user.id})
     this.relayMessage(jid, order.message, { messageId: order.key.id })
     },
     },
    copyNForward: {
      async value(jid, message, forwardingScore = true, options = {}) {
        let vtype;
        if (options.readViewOnce && message.message.viewOnceMessage?.message) {
          vtype = Object.keys(message.message.viewOnceMessage.message)[0];
          delete message.message.viewOnceMessage.message[vtype].viewOnce;
          message.message = proto.Message.fromObject(
              JSON.parse(JSON.stringify(message.message.viewOnceMessage.message)),
          );
          message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo;
        }
        const mtype = Object.keys(message.message)[0];
        let m = generateForwardMessageContent(message, !!forwardingScore);
        const ctype = Object.keys(m)[0];
        if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore;
        m[ctype].contextInfo = {
          ...(message.message[mtype].contextInfo || {}),
          ...(m[ctype].contextInfo || {}),
        };
        m = generateWAMessageFromContent(jid, m, {
          ...options,
          userJid: this.user.jid,
        });
        await this.relayMessage(jid, m.message, {messageId: m.key.id, additionalAttributes: {...options}});
        return m;
      },
      enumerable: true,
    },
    processMessageStubType: {
        async value(m) {
        if (!m.messageStubType) return;
        const chat = this.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '');
        if (!chat || chat === 'status@broadcast') return;
        const emitGroupUpdate = (update) => {
          ev.emit('groups.update', [{id: chat, ...update}]);
        };
        switch (m.messageStubType) {
          case WAMessageStubType.REVOKE:
          case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
            emitGroupUpdate({revoke: m.messageStubParameters[0]});
            break;
          case WAMessageStubType.GROUP_CHANGE_ICON:
            emitGroupUpdate({icon: m.messageStubParameters[0]});
            break;
          default: {
            console.log({
              messageStubType: m.messageStubType,
              messageStubParameters: m.messageStubParameters,
              type: WAMessageStubType[m.messageStubType],
            });
            break;
          }
        }
        const isGroup = chat.endsWith('@g.us');
        if (!isGroup) return;
        let chats = this.chats[chat];
        if (!chats) chats = this.chats[chat] = {id: chat};
        chats.isChats = true;
        const metadata = await this.groupMetadata(chat).catch((_) => null);
        if (!metadata) return;
        chats.subject = metadata.subject;
        chats.metadata = metadata;
      },
    },
    insertAllGroup: {
      async value() {
        const groups = await this.groupFetchAllParticipating().catch((_) => null) || {};
        for (const group in groups) this.chats[group] = {...(this.chats[group] || {}), id: group, subject: groups[group].subject, isChats: true, metadata: groups[group]};
        return this.chats;
      },
    },
    serializeM: {
      /**
             * Serialize Message, so it easier to manipulate
             * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} m
             */
      value(m) {
        return smsg(this, m);
      },
    },
        ...(typeof this.chatRead !== 'function' ? {
      chatRead: {
        /**
                 * Read message
                 * @param {String} jid
                 * @param {String|undefined|null} participant
                 * @param {String} messageID
                 */
        value(jid, participant = this.user.jid, messageID) {
          return this.sendReadReceipt(jid, participant, [messageID]);
        },
        enumerable: true,
      },
    } : {}),
    ...(typeof this.setStatus !== 'function' ? {
      setStatus: {
        /**
                 * setStatus bot
                 * @param {String} status
                 */
        value(status) {
          return this.query({
            tag: 'iq',
            attrs: {
              to: S_WHATSAPP_NET,
              type: 'set',
              xmlns: 'status',
            },
            content: [
              {
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8'),
              },
            ],
          });
        },
        enumerable: true,
      },
    } : {}),
    })
  if (sock.user?.id) sock.user.jid = sock.decodeJid(sock.user.id)
  store.bind(sock)
  return sock
}

    
/**
 * Serialize Message
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {Boolean} store
 */
function smsg(conn, m, hasParent) {
if (!m) return m
const M = proto.WebMessageInfo;
  m = M.fromObject(m);
  m.conn = conn;
  let protocolMessageKey;
  if (m.message) {
    if (m.mtype == 'protocolMessage' && m.msg.key) {
      protocolMessageKey = m.msg.key;
      if (protocolMessageKey == 'status@broadcast') protocolMessageKey.remoteJid = m.chat;
      if (!protocolMessageKey.participant || protocolMessageKey.participant == 'status_me') protocolMessageKey.participant = m.sender;
      protocolMessageKey.fromMe = conn.decodeJid(protocolMessageKey.participant) === conn.decodeJid(conn.user.id);
      if (!protocolMessageKey.fromMe && protocolMessageKey.remoteJid === conn.decodeJid(conn.user.id)) protocolMessageKey.remoteJid = m.sender;
    }
    if (m.quoted) if (!m.quoted.mediaMessage) delete m.quoted.download;
  }
  if (!m.mediaMessage) delete m.download;

  try {
    if (protocolMessageKey && m.mtype == 'protocolMessage') conn.ev.emit('message.delete', protocolMessageKey);
  } catch (e) {
    console.error(e);
  }
  


return m

}

function serialize() {
  const MediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'];
  return Object.defineProperties(proto.WebMessageInfo.prototype, {
    conn: {
      value: undefined,
      enumerable: false,
      writable: true,
    },
    id: {
      get() {
        return this.key?.id;
      },
    },
    isBaileys: {
      get() {
        return this.id?.length === 16 || this.id?.startsWith('3EB0') && this.id?.length === 12 || false;
      },
    },
    chat: {
      get() {
        const senderKeyDistributionMessage = this.message?.senderKeyDistributionMessage?.groupId;
        return (
          this.key?.remoteJid ||
                    (senderKeyDistributionMessage &&
                        senderKeyDistributionMessage !== 'status@broadcast'
                    ) || ''
        ).decodeJid();
      },
    },
    isGroup: {
      get() {
        return this.chat.endsWith('@g.us');
      },
      enumerable: true,
    },
    sender: {
      get() {
        return this.conn?.decodeJid(this.key?.fromMe && this.conn?.user.id || this.participant || this.key.participant || this.chat || '');
      },
      enumerable: true,
    },
    fromMe: {
      get() {
        return this.key?.fromMe || areJidsSameUser(this.conn?.user.id, this.sender) || false;
      },
    },
    mtype: {
      get() {
        if (!this.message) return '';
        const type = Object.keys(this.message);
        return (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) || // Sometimes message in the front
                    (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3
                    type[type.length - 1]; // common case
      },
      enumerable: true,
    },
    msg: {
      get() {
        if (!this.message) return null;
        return this.message[this.mtype];
      },
    },
    mediaMessage: {
      get() {
        if (!this.message) return null;
        const Message = ((this.msg?.url || this.msg?.directPath) ? {...this.message} : extractMessageContent(this.message)) || null;
        if (!Message) return null;
        const mtype = Object.keys(Message)[0];
        return MediaType.includes(mtype) ? Message : null;
      },
      enumerable: true,
    },
    mediaType: {
      get() {
        let message;
        if (!(message = this.mediaMessage)) return null;
        return Object.keys(message)[0];
      },
      enumerable: true,
    },
    quoted: {
      get() {
        /**
                 * @type {ReturnType<typeof makeWASocket>}
                 */
        const self = this;
        const msg = self.msg;
        const contextInfo = msg?.contextInfo;
        const quoted = contextInfo?.quotedMessage;
        if (!msg || !contextInfo || !quoted) return null;
        const type = Object.keys(quoted)[0];
        const q = quoted[type];
        const text = typeof q === 'string' ? q : q.text;
        return Object.defineProperties(JSON.parse(JSON.stringify(typeof q === 'string' ? {text: q} : q)), {
          mtype: {
            get() {
              return type;
            },
            enumerable: true,
          },
          mediaMessage: {
            get() {
              const Message = ((q.url || q.directPath) ? {...quoted} : extractMessageContent(quoted)) || null;
              if (!Message) return null;
              const mtype = Object.keys(Message)[0];
              return MediaType.includes(mtype) ? Message : null;
            },
            enumerable: true,
          },
          mediaType: {
            get() {
              let message;
              if (!(message = this.mediaMessage)) return null;
              return Object.keys(message)[0];
            },
            enumerable: true,
          },
          id: {
            get() {
              return contextInfo.stanzaId;
            },
            enumerable: true,
          },
          chat: {
            get() {
              return contextInfo.remoteJid || self.chat;
            },
            enumerable: true,
          },
          isBaileys: {
            get() {
              return this.id?.length === 16 || this.id?.startsWith('3EB0') && this.id.length === 12 || false;
            },
            enumerable: true,
          },
          sender: {
            get() {
              return (contextInfo.participant || this.chat || '').decodeJid();
            },
            enumerable: true,
          },
          fromMe: {
            get() {
              return areJidsSameUser(this.sender, self.conn?.user.jid);
            },
            enumerable: true,
          },
          text: {
            get() {
              return text || this.caption || this.contentText || this.selectedDisplayText || '';
            },
            enumerable: true,
          },
          mentionedJid: {
            get() {
              return q.contextInfo?.mentionedJid || self.getQuotedObj()?.mentionedJid || [];
            },
            enumerable: true,
          },
          name: {
            get() {
              const sender = this.sender;
              return sender ? self.conn?.getName(sender) : null;
            },
            enumerable: true,

          },
          vM: {
            get() {
              return proto.WebMessageInfo.fromObject({
                key: {
                  fromMe: this.fromMe,
                  remoteJid: this.chat,
                  id: this.id,
                },
                message: quoted,
                ...(self.isGroup ? {participant: this.sender} : {}),
              });
            },
          },
          fakeObj: {
            get() {
              return this.vM;
            },
          },
          download: {
            value(saveToFile = false) {
              const mtype = this.mediaType;
              return self.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile);
            },
            enumerable: true,
            configurable: true,
          },
          reply: {
            /**
                         * Reply to quoted message
                         * @param {String|Object} text
                         * @param {String|false} chatId
                         * @param {Object} options
                         */
            value(text, chatId, options) {
              return self.conn?.reply(chatId ? chatId : this.chat, text, this.vM, options);
            },
            enumerable: true,
          },
          copy: {
            /**
                         * Copy quoted message
                         */
            value() {
              const M = proto.WebMessageInfo;
              return smsg(conn, M.fromObject(M.toObject(this.vM)));
            },
            enumerable: true,
          },
          forward: {
            /**
                         * Forward quoted message
                         * @param {String} jid
                         *  @param {Boolean} forceForward
                         */
            value(jid, force = false, options) {
              return self.conn?.sendMessage(jid, {
                forward: this.vM, force, ...options,
              }, {...options});
            },
            enumerable: true,
          },
          copyNForward: {
            /**
                         * Exact Forward quoted message
                         * @param {String} jid
                         * @param {Boolean|Number} forceForward
                         * @param {Object} options
                         */
            value(jid, forceForward = false, options) {
              return self.conn?.copyNForward(jid, this.vM, forceForward, options);
            },
            enumerable: true,

          },
          cMod: {
            /**
                         * Modify quoted Message
                         * @param {String} jid
                         * @param {String} text
                         * @param {String} sender
                         * @param {Object} options
                         */
            value(jid, text = '', sender = this.sender, options = {}) {
              return self.conn?.cMod(jid, this.vM, text, sender, options);
            },
            enumerable: true,

          },
          delete: {
            /**
                         * Delete quoted message
                         */
            value() {
              return self.conn?.sendMessage(this.chat, {delete: this.vM.key});
            },
            enumerable: true,

          },
        });
      },
      enumerable: true,
    },
    _text: {
      value: null,
      writable: true,
    },
    text: {
      get() {
        const msg = this.msg;
        const text = (typeof msg === 'string' ? msg : msg?.text) || msg?.caption || msg?.contentText || '';
        return typeof this._text === 'string' ? this._text : '' || (typeof text === 'string' ? text : (
                    text?.selectedDisplayText ||
                    text?.hydratedTemplate?.hydratedContentText ||
                    text
                )) || '';
      },
      set(str) {
        return this._text = str;
      },
      enumerable: true,
    },
    mentionedJid: {
      get() {
        return this.msg?.contextInfo?.mentionedJid?.length && this.msg.contextInfo.mentionedJid || [];
      },
      enumerable: true,
    },
    name: {
      get() {
        return !nullish(this.pushName) && this.pushName || this.conn?.getName(this.sender);
      },
      enumerable: true,
    },
    download: {
      value(saveToFile = false) {
        const mtype = this.mediaType;
        return this.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile);
      },
      enumerable: true,
      configurable: true,
    },
    reply: {
      value(text, chatId, options) {
        return this.conn?.reply(chatId ? chatId : this.chat, text, this, options);
      },
    },
    copy: {
      value() {
        const M = proto.WebMessageInfo;
        return smsg(this.conn, M.fromObject(M.toObject(this)));
      },
      enumerable: true,
    },
    forward: {
      value(jid, force = false, options = {}) {
        return this.conn?.sendMessage(jid, {
          forward: this, force, ...options,
        }, {...options});
      },
      enumerable: true,
    },
    copyNForward: {
      value(jid, forceForward = false, options = {}) {
        return this.conn?.copyNForward(jid, this, forceForward, options);
      },
      enumerable: true,
    },
    cMod: {
      value(jid, text = '', sender = this.sender, options = {}) {
        return this.conn?.cMod(jid, this, text, sender, options);
      },
      enumerable: true,
    },
    getQuotedObj: {
      value() {
        if (!this.quoted.id) return null;
        const q = proto.WebMessageInfo.fromObject(this.conn?.loadMessage(this.quoted.id) || this.quoted.vM);
        return smsg(this.conn, q);
      },
      enumerable: true,
    },
    getQuotedMessage: {
      get() {
        return this.getQuotedObj;
      },
    },
    delete: {
      value() {
        return this.conn?.sendMessage(this.chat, {delete: this.key});
      },
      enumerable: true,
    },
  });
}

function protoType() {
  Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
    const ab = new ArrayBuffer(this.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < this.length; ++i) {
      view[i] = this[i];
    }
    return ab;
  };
  /**
     * @return {ArrayBuffer}
     */
  Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
    return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength);
  };
  /**
     * @return {Buffer}
     */
  ArrayBuffer.prototype.toBuffer = function toBuffer() {
    return Buffer.from(new Uint8Array(this));
  };
  // /**
  //  * @returns {String}
  //  */
  // Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
  //     return util.format(this)
  // }
  Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
    return await fileTypeFromBuffer(this);
  };
  /**
     * @returns {Boolean}
     */
  String.prototype.isNumber = Number.prototype.isNumber = isNumber;
  /**
     *
     * @return {String}
     */
  String.prototype.capitalize = function capitalize() {
    return this.charAt(0).toUpperCase() + this.slice(1, this.length);
  };
  /**
     * @return {String}
     */
  String.prototype.capitalizeV2 = function capitalizeV2() {
    const str = this.split(' ');
    return str.map((v) => v.capitalize()).join(' ');
  };
  String.prototype.decodeJid = function decodeJid() {
    if (/:\d+@/gi.test(this)) {
      const decode = jidDecode(this) || {};
      return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim();
    } else return this.trim();
  }
  Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
}
function isNumber() {
  const int = parseInt(this);
  return typeof int === 'number' && !isNaN(int);
}
function getRandom() {
  if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)];
  return Math.floor(Math.random() * this);
}
function format(...args) {
	return util.format(...args)
}
function nullish(args) {
  return !(args !== null && args !== undefined) // ????
}   



exports.protoType = protoType
exports.serialize = serialize
exports.smsg = smsg
exports.makeWaSocket = makeWaSocket