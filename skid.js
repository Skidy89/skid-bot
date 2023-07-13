// Código desde cero y comentarios hecho por: 
// @gata_dios
// @Skidy89

// Importaciones 
const baileys = require('@whiskeysockets/baileys'); // trabajar a través de descargas por Whatsapp 
const moment = require('moment-timezone') // Trabajar con fechas y horas en diferentes zonas horarias
const gradient = require('gradient-string') // Aplicar gradientes de color al texto
const { execSync } = require('child_process') // Función 'execSync' del módulo 'child_process' para ejecutar comandos en el sistema operativo
const chalk = require('chalk') // Estilizar el texto en la consola
const os = require('os') // Proporciona información del sistema operativo
const fs = require('fs') // Trabajar con el sistema de archivos
const fetch = require('node-fetch')
const axios = require('axios')
const cheerio = require('cheerio')
const gpt = require('api-dylux')

const color = (text, color) => { // Función 'color' que toma un texto y un color como parámetros
return !color ? chalk.cyanBright(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text)} // Si no hay color, utilizar el color celeste brillante (por defecto)

// Importa varias funciones y objetos
const { smsg, getGroupAdmins, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, delay, format, logic, generateProfilePicture, parseMention, getRandom } = require('./libs/fuctions')
const { default: makeWASocket, proto } = require("@whiskeysockets/baileys") // Importa los objetos 'makeWASocket' y 'proto' desde el módulo '@whiskeysockets/baileys'
const { ytmp4, ytmp3, ytplay, ytplayvid } = require('./libs/youtube')
const speed = require("performance-now")
const ffmpeg = require("fluent-ffmpeg")

const msgs = (message) => { // Función 'msgs' que toma un parámetro 'message'
if (message.length >= 10) { // Longitud de 'message' es mayor o igual a 10 caracteres
return `${message.substr(0, 500)}` // Devuelve los primeros 500 caracteres de 'message'
} else { // Caso contrario
return `${message}`}} // Devuelve 'message' completo

const getCmd = (id) => { //Función llamada 'getCmd' que toma un parámetro 'id'
const stickerdb = JSON.parse(fs.readFileSync('./database/stickerdb.json'))
let anu = null;
Object.keys(stickerdb).forEach(nganu => { // Itera sobre las claves del objeto 'stickerdb' utilizando 'forEach'
if (stickerdb[nganu].id === id) { // Si el valor de la propiedad 'id' en el objeto 'stickerdb[nganu]' es igual a 'id'
anu = nganu
}})
if (anu !== null) { // De lo contrario
return stickerdb[anu].cmd // Devolver el valor de la propiedad 'cmd' en el objeto 'stickerdb[anu]'
}}
let blockList = []
/**
* @param {proto.IWebMessageInfo.message} mek
* @param {proto.IWebMessageInfo} chatUpdate
* @param {import("@whiskeysockets/baileys").WASocket} 
*/
module.exports = conn = async (conn, m, chatUpdate, mek) => { // Raíz "conn" para mensajes y argumentos
var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage' && m.message.imageMessage.caption) ? m.message.imageMessage.caption : (m.mtype == 'videoMessage' && m.message.videoMessage.caption ) ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :  (m.mtype == 'stickerMessage') && (getCmd(m.message.stickerMessage.fileSha256.toString()) !== null && getCmd(m.message.stickerMessage.fileSha256.toString()) !== undefined) ? getCmd(m.message.stickerMessage.fileSha256.toString()) : ''
	
// ‿︵‿︵ʚɞ『 ATRIBUTOS 』ʚɞ‿︵‿︵
if (m.key.id.startsWith("BAE5")) return
var budy = (typeof m.text == 'string' ? m.text : '') // Asignar a la variable budy el valor m.text si es cadena	
//var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=/|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=/|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
global.prefix = new RegExp('^[°•π÷×¶∆£¢€¥®™+✓_=/|~!?@#$%^&.©^' + '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-.@'.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']', 'i')
var prefix = global.prefix.test(body) ? body.match(global.prefix)[0] : '' // Almacenar el prefijo predeterminado
const isCmd = body.startsWith(prefix) // Verificar si el contenido de body comienza con el valor almacenado en prefix.
const from = m.chat // Remitente del mensaje
const msg = JSON.parse(JSON.stringify(mek, undefined, 2)) // Mensaje convertido a formato JSON
const content = JSON.stringify(m.message) // Contenido del mensaje convertido a formato JSON
const type = m.mtype // Tipo de mensaje
const arg = body.substring(body.indexOf(' ') + 1) // Argumento extraído del cuerpo del mensaje
const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() // Comando extraído del cuerpo del mensaje
const args = body.trim().split(/ +/).slice(1) // Obtiene los argumentos del comando
const q = args.join(" ") // Une los argumentos en una sola cadena separada por espacios
let t = m.messageTimestamp // Marca de tiempo de mensaje
const pushname = m.pushName || "Sin nombre" // Obtiene el nombre de visualización del usuario de lo contrario será "Sin nombre"
const botnm = conn.user.id.split(":")[0] + "@s.whatsapp.net"
const userSender = m.key.fromMe ? botnm : m.isGroup && m.key.participant.includes(":") ? m.key.participant.split(":")[0] + "@s.whatsapp.net" : m.key.remoteJid.includes(":") ? m.key.remoteJid.split(":")[0] + "@s.whatsapp.net" : m.key.fromMe ? botnm : m.isGroup ? m.key.participant : m.key.remoteJid
const isCreator = global.owner.map(([numero]) => numero.replace(/[^\d\s().+:]/g, '').replace(/\s/g, '') + '@s.whatsapp.net').includes(userSender) // Eliminar todo a excepción de números 
const itsMe = m.sender == conn.user.id ? true : false // Verifica si el remitente del mensaje es el propio bot
const text = args.join(" ") // Unir rgumentos en una sola cadena separada por espacios
const quoted = m.quoted ? m.quoted : m // Obtiene el mensaje citado si existe, de lo contrario, se establece como el propio mensaje
const sender = m.key.fromMe ? botnm : m.isGroup ? m.key.participant : m.key.remoteJid // Obtiene el remitente del mensaje según el tipo de chat (individual o grupo)
const mime = (quoted.msg || quoted).mimetype || '' // Tipo de archivo adjunto del mensaje citado o del propio mensaje
const isMedia = /image|video|sticker|audio/.test(mime) // Verifica si el mensaje contiene un archivo multimedia (imagen, video, sticker o audio)
const numBot = conn.user.id.split(":")[0] + "@s.whatsapp.net" // JID del Bot
const numBot2 = conn.user.id // Número de teléfono del bot
const mentions = []
if (m.message[type].contextInfo) { 
if (m.message[type].contextInfo.mentionedJid) {
const msd = m.message[type].contextInfo.mentionedJid
for (let i = 0; i < msd.length; i++) {
mentions.push(msd[i])}}}
	
// ‿︵‿︵ʚɞ『 GRUPO 』ʚɞ‿︵‿︵
const groupMetadata = m.isGroup ? await conn.groupMetadata(from) : '' // Obtiene información del grupo
const groupName = m.isGroup ? groupMetadata.subject : '' // Nombre del grupo
const participants = m.isGroup ? await groupMetadata.participants : '' // Lista de participantes del grupo
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : '' // // Lista de administradores del grupo

const isBotAdmins = m.isGroup ? groupAdmins.includes(numBot) : false // Verifica si el bot es un administrador del grupo
const isGroupAdmins = m.isGroup ? groupAdmins.includes(userSender) : false // Verifica si el remitente del mensaje es un administrador del grupo
const isBaneed = m.isGroup ? blockList.includes(userSender) : false // Verifica si el remitente del mensaje está en la lista de bloqueados

// ‿︵‿︵ʚɞ『 TIPOS DE MENSAJES Y CITADOS 』ʚɞ‿︵‿︵
const reply = (text) => {
m.reply(text)} // Enviar una respuesta

const isAudio = type == 'audioMessage' // Mensaje de Audio
const isSticker = type == 'stickerMessage' // Mensaje de Sticker
const isContact = type == 'contactMessage' // Mensaje de Contacto
const isLocation = type == 'locationMessage' // Mensaje de Localización 
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
const isQuotedMsg = type === 'extendedTextMessage' && content.includes('Message') // Mensaje citado de cualquier tipo
const isViewOnce = (type === 'viewOnceMessage') // Verifica si el tipo de mensaje es (mensaje de vista única)

//base de datos
let isNumber = x => typeof x === 'number' && !isNaN(x)
let user = global.db.data.users[m.sender]
if (typeof user !== 'object') global.db.data.users[m.sender] = {}
if (user) {
if (!isNumber(user.afkTime)) user.afkTime = -1
if (!('afkReason' in user)) user.afkReason = ''
if (!isNumber(user.limit)) user.limit = 20
 } else global.db.data.users[m.sender] = {
afkTime: -1,
afkReason: '',
limit: 20,
}
    
let chats = global.db.data.chats[m.chat]
if (typeof chats !== 'object') global.db.data.chats[m.chat] = {}
if (chats) {
if (!('antilink' in chats)) chats.antilink = false
} else global.db.data.chats[m.chat] = {
antilink: false,
}
let setting = global.db.data.settings[numBot]
if (typeof setting !== 'object') global.db.data.settings[numBot] = {}
if (setting) {
if (!isNumber(setting.status)) setting.status = 0
if (!('autobio' in setting)) setting.autobio = true
} else global.db.data.settings[numBot] = {
status: 0,
autobio: true, 
}
//

//autobio no funka
	/*if (db.data.settings[numBot].autobio) {
	    let setting = global.db.data.settings[numBot]
	    if (new Date() * 1 - setting.status > 1000) {
		//let uptime = await runtime(process.uptime())
	   conn.setStatus(`Bot el Desarrollo 🐈${runtime(process.uptime())}*`)
		setting.status = new Date() * 1
	    }
	} */ 
	
//antilink
if (db.data.chats[m.chat].antilink) {
if (budy.match(`chat.whatsapp.com`)) {
let delet = m.key.participant
let bang = m.key.id
reply(`*「 ANTI LINK 」*\n\n*Detectado sera expulsado del grupo sucia rata 🙄*`)
if (!isBotAdmins) return reply(`El bot necesita admin para eliminar al incluso 🙄`)
let gclink = (`https://chat.whatsapp.com/`+await conn.groupInviteCode(m.chat))
let isLinkThisGc = new RegExp(gclink, 'i')
let isgclink = isLinkThisGc.test(m.text)
//if (isgclink) return reply(`Te salvarte el link enviado es de este grupo`)
// if (isAdmins) return reply(`Te salvarte perra eres admin jjj`)
conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}}
        
// Tiempo de Actividad del bot
const used = process.memoryUsage()
const cpus = os.cpus().map(cpu => {
cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
return cpu
})
//conn.sendReadReceipt(from,sender,[m.key.id])
        
const cpu = cpus.reduce((last, cpu, _, { length }) => {
last.total += cpu.total
last.speed += cpu.speed / length
last.times.user += cpu.times.user
last.times.nice += cpu.times.nice
last.times.sys += cpu.times.sys
last.times.idle += cpu.times.idle
last.times.irq += cpu.times.irq
return last
}, {
speed: 0,
total: 0,
times: {
user: 0,
nice: 0,
sys: 0,
idle: 0,
irq: 0
}})

// ya lo pobre puta gata
const thumb = fs.readFileSync("./media/test.jpg")
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${userSender.split('@')[0]}:${userSender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
const ftroli ={key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "status@broadcast"}, "message": {orderMessage: {itemCount: 2022,status: 200, thumbnail: thumb, surface: 200, message: "puta gata", orderTitle: "puto aiden me lo folle", sellerJid: '0@s.whatsapp.net'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
const fdoc = {key : {participant : '0@s.whatsapp.net', ...(from ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: "A", jpegThumbnail: null}}}//const fgif = {key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: {"videoMessage": { "title":botname, "h": wm,'seconds': '359996400', 'gifPlayback': 'true', 'caption': ownername, 'jpegThumbnail': thumb}}}
//const fgclink = {key: {participant: "0@s.whatsapp.net","remoteJid": "0@s.whatsapp.net"},"message": {"groupInviteMessage": {"groupJid": "6288213840883-1616169743@g.us","inviteCode": "m","groupName": wm, "caption": `${pushname}`, 'jpegThumbnail': thumb}}}
//const fvideo = {key: { fromMe: false,participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) },message: { "videoMessage": { "title":botname, "h": wm,'seconds': '359996400', 'caption': `${pushname}`, 'jpegThumbnail': thumb}}}
//const fakeimg = { key: {participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "6289643739077-1613049930@g.us" } : {})},message: {"imageMessage": { "title":`*yo soy aiden*`, "h": `Hmm`,'seconds': '99999', 'imagePlayback': 'true', 'caption': `pene quiero pene aiden`, 'jpegThumbnail': thumb }}}
//const floc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {locationMessage: {name: wm,jpegThumbnail: thumb}}}
//const fakestatus = {key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})},message: { "imageMessage": {"url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc","mimetype": "image/jpeg","caption": 'aiden pendejo',"fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=","fileLength": "28777","height": 1080,"width": 1079,"mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=","fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=","directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69","mediaKeyTimestamp": "1610993486","jpegThumbnail": fs.readFileSync('./media/cheemspic.jpg'),"scansSidecar": "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw=="}}}
const kick = function (from, orangnya) {
for (let i of orangnya) {
conn.groupParticipantsUpdate(from, [i], "remove");
}}
const time = moment(Number(msg.messageTimestamp + "000")).locale("es-mx").tz("America/Asuncion").format('MMMM Do YYYY, h:mm:ss a')

// ‿︵‿︵ʚɞ『 INFO CONSOLE 』ʚɞ‿︵‿︵	
if (m.message) {
console.log(chalk.bold.cyanBright(botname), 
chalk.bold.magenta('\nHORARIO: ') + chalk.magentaBright(moment(t * 1000).tz(place).format('DD/MM/YY HH:mm:ss'),
chalk.bold.yellow('\nTIPO (SMS): ') + chalk.yellowBright(`${type}`), 
chalk.bold.cyan('\nUSUARIO: ') + chalk.cyanBright(pushname) + ' ➜', gradient.rainbow(userSender), 
m.isGroup ? chalk.bold.greenBright('\nGRUPO: ') + chalk.greenBright(groupName) + ' ➜ ' + gradient.rainbow(from) : chalk.bold.greenBright('CHAT PRIVADO'), 
//chalk.bold.red('\nETIQUETA: ') + chalk.redBright(`[${isBaneed ? 'Banned' : ''}]`),
chalk.bold.white('\nMENSAJE: ') + chalk.whiteBright(`${msgs(m.text)}\n`))
)}

switch (command) {
case 'imagen': //envia una imagen
imagen = fs.readFileSync('./media/img_rectangular.jpg') // puede ser cualquier imagen como en plugins
conn.sendMessage(m.chat, {image: imagen, caption: '*YAOI*' }, { quoted: m }) 
break

case 'yts':
  if (!text) throw `Ejemplo: ${prefix + comand} historia wa anime`;
const yts = require("youtube-yts");
const search = await yts(text);
let teks = 'Búsqueda en YouTube\n\nResultados de ' + text + '\n\n';
let no = 1;
let themeemoji = "✨"
for (let i of search.all) {
  teks += `${themeemoji} No: ${no++}\n${themeemoji} Tipo: ${i.type}\n${themeemoji} ID del Video: ${i.videoId}\n${themeemoji} Título: ${i.title}\n${themeemoji} Vistas: ${i.views}\n${themeemoji} Duración: ${i.timestamp}\n${themeemoji} Subido: ${i.ago}\n${themeemoji} URL: ${i.url}\n\n━━━━━━━━━━━━\n\n`;
}
await conn.sendMessage(from, { image: { url: search.all[0].thumbnail }, caption: teks }, { quoted: fkontak });
break
case 'query': // envia un mensaje en forma de ad
conn.sendMessage(from, {text: "puta gata", contextInfo: {
externalAdReply: {
title: "puta gata", // titulo
body: "chingas a tu madre aiden", // cuerpo del mensaje (subtitulo)
mediaUrl: null, // tampoco se :v
sourceUrl: null, // nose :v
previewType: 'PHOTO', // puedes cambiarlo segun lo que quieras gata
showAdAttribution: true, //puedes cambiarlo a false si gustas
thumbnail: null, // imagen puedes hacer a traves de fs o dejarlo null
sourceUrl: 'github.com/skidy89' //link
    }
  }}, {});
break

case 'text': // envia un puto mensaje como persona normal
conn.sendMessage(from, { text: "puto aiden" }, { quoted: fkontak })
break

//case "react": // reacion para tu puto spam
//conn.sendMessage(from, { react: { text: emoji,  key: m.key}})
//break

case 'antilink': {
if (!m.isGroup) return reply(`[ ⚠️ ] solo el grupo`)
if (!isBotAdmins) return reply(`[ ⚠️ ] Necesito ser admin`)
if (args[0] === "on") {
if (db.data.chats[m.chat].antilink) return reply(`Activo`)
db.data.chats[m.chat].antilink = true
reply(`✅El AntiLink se activo con exito!`)
} else if (args[0] === "off") {
if (!db.data.chats[m.chat].antilink) return reply(`off`)
db.data.chats[m.chat].antilink = false
reply(`AntiLink desactivado !`)
}}
break

case 'tagall': {
if (!m.isGroup) return reply(`[ ⚠️ ] solo el grupo`)
if (!isBotAdmins) return reply(`[ ⚠️ ] Necesito ser admin`)
//if (!isAdmins) return reply(`[ ⚠️ ] No eres admin`)
  let teks = `✿ ━〔 *🍬 𝐈𝐍𝐕𝐎𝐂𝐀𝐂𝐈𝐎́𝐍 𝐌𝐀𝐒𝐈𝐕𝐀  🍬* 〕━ ✿\n\n`
  teks += `✿ 𝐒𝐔 𝐀𝐃𝐌𝐈𝐍 𝐋𝐎𝐒 𝐈𝐍𝐕𝐎𝐂𝐀, 𝐑𝐄𝐕𝐈𝐕𝐀𝐍\n\n`
  teks += `✿ 𝐌𝐄𝐍𝐒𝐀𝐉𝐄:  ${q ? q : 'no message'}\n\n`
  for (let mem of participants) {
    teks += `┃@${mem.id.split('@')[0]}\n⁩`
    teks += `┃𝐊𝐢𝐦𝐝𝐚𝐧𝐁𝐨𝐭-𝙈𝘿 : 𝐊𝐢𝐦 𝐃𝐚𝐧\n`
  }
  teks += `╰━━━━━[ *✰ 𝐔𝐰𝐔 ✰* ]━━━━━⬣`
  conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
}
break
            case 'sticker': case 's': case 'stickergif': case 'sgif': {
            if (!quoted) return reply(`Reply Video/Image With Caption ${prefix + command}`)
            //reply(mess.wait)
                    if (/image/.test(mime)) {
                let media = await quoted.download()
                let encmedia = await conn.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                await fs.unlinkSync(encmedia)
            } else if (/video/.test(mime)) {
                if ((quoted.msg || quoted).seconds > 11) return reply('Maximum 10 Seconds!')
                let media = await quoted.download()
                let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                await fs.unlinkSync(encmedia)
            } else {
                reply(`*Y LA IMAGEN?*`)
                }
            }
            break

case 'estado':
  const totalMemory = Math.round(os.totalmem() / (1024 * 1024 * 1024)); 
  const freeMemory = Math.round(os.freemem() / (1024 * 1024 * 1024)); 
  const usedMemory = totalMemory - freeMemory;
  const cpuUsage = os.loadavg()[0];

  conn.sendMessage(from, {
    text: `*╭𝄗𝄗✦ --${botname}-- ✦𝄗𝄗⬣*
⎸ *⍟ Versión*
⎸ ❉ ➺ ${vs}
⎸ ┈┈┈┈┈┈┈┈┈┈┈
⎸ ❉ *Actividad ➺ ${runtime(process.uptime())}*
⎸ ❉ *RAM usada ➺ ${usedMemory} GB / ${totalMemory} GB*
⎸ ❉ *CPU usada ➺ ${cpuUsage.toFixed(2)}%*
⎸ ❉ *Memoria total ➺ ${totalMemory} GB*
*╰𝄗𝄗𝄗𝄗𝄗⬣*`
  }, { quoted: fkontak });
  break;

		
 case 'ping':
var timestamp = speed();
var latensi = speed() - timestamp
conn.sendMessage(from, { text: `*Pong 🏓  ${latensi.toFixed(4)}*` }, { quoted: msg });  
     break
     
     case 'ia':
     case 'chatgpt':
     if (!text) return conn.sendMessage(from, { text: `*INGRESE EL TEXTO DE LOS QUE QUIERE BUSCAR?*` }, { quoted: msg })
     await conn.sendPresenceUpdate('composing', m.chat)
var syms = `Actuaras como un Bot de WhatsApp y tu lenguaje principal es multi lenguage, tu seras GataBotPlus-MD 🐈, y tu creadora es GataNina-Li, Si te piden tus comandos, menu tu mandas lo siguiente:\n\n*Soy un bot nuevo Que estoy desarollo :v*\n\nSi te piden un tutorial para hacer o instalar un Bot o algo relacion con tu instalacion o obetenerte para un grupo le recomiendas este canal https://www.youtube.com/@gatadios\nSi te piden numero numero de la creadora por ayudar dile esto: si tiene alguna duda, error, configurar GataBot, puede comentarla en el Grupo para que sea respodida entre todos Respete al Grupo y a sus integrantes, y recuerde dar Gracias por la ayuda brindada\n\nhttps://chat.whatsapp.com/IXZ0aBryB1cHjNxe0VIm76`
var res = await gpt.ChatGpt(text, syms)
await m.reply(res.text)
break

case 'play':
if (!text) return conn.sendMessage(from, { text: `*ingrese nombre de alguna cancion*` }, { quoted: msg })
conn.sendMessage(from, { text: `*Aguarde un momento*` }, { quoted: fdoc });    
let aud = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=GataDios&query=${text}`) 
let json = await aud.json()
let kingcore = await ytplay(text)
let audiodownload = json.result.audio
if (!audiodownload) audiodownload = kingcore.result
await conn.sendMessage(from, { audio: { url: audiodownload }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg })
break

case 'play2':    
if (!text) return conn.sendMessage(from, { text: `*ingrese nombre de alguna cancion*` }, { quoted: msg })
conn.sendMessage(from, { text: `*Aguarde un momento*` }, { quoted: fdoc });    
let mediaa = await ytplayvid(textoo)
await conn.sendMessage(from, { video: { url: mediaa.result }, fileName: `error.mp4`, thumbnail: mediaa.thumb, mimetype: 'video/mp4' }, { quoted: msg });
break               

case 'update':
if (!isCreator) return conn.sendMessage(from, { text: `*ESTE COMANDO ES PARA MI JEFE*` }, { quoted: msg });    
try {    
let stdout = execSync('git pull' + (m.fromMe && q ? ' ' + q : ''))
await conn.sendMessage(from, { text: stdout.toString() }, { quoted: msg });
} catch { 
let updatee = execSync('git remote set-url origin https://github.com/GataNina-Li/GataBotPlus-MD.git && git pull')
await conn.sendMessage(from, { text: updatee.toString() }, { quoted: msg })}  
break
        
        default:
            if (budy.startsWith('>')) {
                if (!isCreator) return
                try {
                    return reply(JSON.stringify(eval(budy.slice(2)), null, '\t'))
                } catch (e) {
                    e = String(e)
                    reply(e)
                }
            }
            if (budy.startsWith('=>')) {
                if (!isCreator) return
                try {
                    return  reply(JSON.stringify(eval(`(async () => { ${budy.slice(3)} })()`), null, '\t'))  //gata.sendMessage(from, JSON.stringify(eval(`(async () => { ${budy.slice(3)} })()`), null, '\t'), text, { quoted: msg })
                } catch (e) {
                    e = String(e)
                    reply(e)
                }
            }
            if (budy.startsWith('$')) {
                if (!isCreator) return
                try {
                    return reply(String(execSync(budy.slice(2), { encoding: 'utf-8' })))
                } catch (e) {
                    e = String(e)
                    reply(e)
                }
            }
        }

}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})