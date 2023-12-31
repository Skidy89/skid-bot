const { canLevelUp, xpRange, cmd, msToTime, pickRandom, getRandom, clockString }= require('../lib/commands.js')
const fs = require('fs')
cmd({
pattern: "lb",
desc: "muestra la leadboard",
category: "rpg",
filename: __filename,
},
async (conn, m, { participants, args}) => {

 let member = participants.map(u => u.id) 
 let me = m.split 
 const users = Object.entries(global.db.data.users).map(([key, value]) => {
 return {...value, jid: key}}); 
 const sortedExp = users.map(toNumber('exp')).sort(sort('exp')); 
 const sortedLim = users.map(toNumber('limit')).sort(sort('limit')); 
 const sortedLevel = users.map(toNumber('level')).sort(sort('level')); 
 const usersExp = sortedExp.map(enumGetKey); 
 const usersLim = sortedLim.map(enumGetKey); 
 const usersLevel = sortedLevel.map(enumGetKey); 
 const len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedExp.length);
   const adventurePhrases = [ 
   "Lidera la aventura y forja tu camino hacia la cima.", 
   "¡Desafía lo desconocido y alcanza nuevas alturas!", 
   "Tu valentía te guiará a la cima de la tabla de clasificación.", 
   "En cada paso, esculpe tu leyenda en esta gran aventura.", 
   "Explora, compite y demuestra tu grandeza en esta tabla.", 
   "Cada paso cuenta en tu viaje hacia la cima del ranking.", 
   "La emoción de la competencia te impulsa hacia adelante.", 
   "Aventúrate y conquista los primeros lugares con determinación.", 
 ]; 
   const randomAdventurePhrase = adventurePhrases[Math.floor(Math.random() * adventurePhrases.length)]; 
   const texto = ` 
 *< TABLA DE LOS AVENTUREROS MÁS DESTACADOS />* 
      
 —◉ *TOP ${len} EXP 🌟* 
 *👤 Tú posición:* ${usersExp.indexOf(m.sender) + 1} de ${usersExp.length} 
  
 ${sortedExp.slice(0, len).map(({jid, exp}, i) => `${i + 1}. ${participants.some((p) => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${exp} exp*`).join`\n`} 
  
 —◉ *TOP ${len} DIAMANTES 💎* 
 *👤 Tú posición:* ${usersLim.indexOf(m.sender) + 1} de ${usersLim.length} 
  
 ${sortedLim.slice(0, len).map(({jid, limit}, i) => `${i + 1}. ${participants.some((p) => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${limit} diamantes*`).join`\n`} 
  
 —◉ *TOP ${len} NIVEL 🎚️* 
 *👤 Tú posición:* ${usersLevel.indexOf(m.sender) + 1} de ${usersLevel.length} 
  
 ${sortedLevel.slice(0, len).map(({jid, level}, i) => `${i + 1}. ${participants.some((p) => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *nivel ${level}*`).join`\n`} 
  
 *⚔️ ${randomAdventurePhrase} ⚔️*`.trim(); 
   conn.sendTextWithMentions(m.chat, texto, m)
 })


cmd({
pattern: "aventura",
desc: "aventurate por recompensas",
category: "rpg",
filename: __filename,
},
async (conn, m) => {
  let cooldown = 10000
  let user = global.db.data.users[m.sender]
  let timer = (cooldown - (new Date - user.lastadventure))
  if (new Date() - user.lastadventure < 10000) m.reply(`*estas demasiado cansado*\n*espera ${msToTime(cooldown - new Date())} para volver a aventurar*`)
  if (user.health < 80) return conn.reply(m.chat, `*estas herido*\npara poder aventurar necesitas minimo 80 de *salud* ♥️\ncompra pociones con ${global.prefix}buy potion y curate con ${global.prefix}health`, m)
  let rewards = reward(user)
  let txt = '*fuiste a una aventura peligrosa*\n*donde perdiste*'
  for (let lost in rewards.lost) {
  let total= rewards.lost[lost].getRandom()
  user[lost] -= total * 1
  if (total) txt += `\n*${global.rpg.emoticon(lost)}:* ${total}`
  }
  txt += '\n\nPero consigues'
  for (let rewardItem in rewards.reward) {
  let total = rewards.reward[rewardItem].getRandom()
  user[rewardItem] += total * 1
  if (total) txt += `\n*${global.rpg.emoticon(rewardItem)}:* ${total}`
  }
  m.reply(txt.trim())
  user.lastadventure = new Date() * 1
  
  function reward(user = {}) { 
     let rewards = { 
         reward: { 
             money: 201 + user.dog * 2000,
             exp: 301 + user.dog * 2000,
             trash: 101, 
             potion: 2, 
             rock: 2, 
             wood: 2, 
             string: 2, 
             common: 2 * (user.dog && (user.dog > 2 ? 2 : user.dog) * 1.2 || 1), 
             uncommon: [0, 0, 0, 1, 0].concat( 
                 new Array(5 - ( 
                     (user.dog > 2 && user.dog < 6 && user.dog) || (user.dog > 5 && 5) || 2 
                 )).fill(0) 
             ), 
             mythic: [0, 0, 0, 0, 0, 1, 0, 0, 0].concat( 
                 new Array(8 - ( 
                     (user.dog > 5 && user.dog < 8 && user.dog) || (user.dog > 7 && 8) || 3 
                 )).fill(0) 
             ), 
             legendary: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0].concat( 
                 new Array(10 - ( 
                     (user.dog > 8 && user.dog) || 4 
                 )).fill(0) 
             ), 
             iron: [0, 0, 0, 1, 0, 0], 
             gold: [0, 0, 0, 0, 0, 1, 0], 
             diamond: [0, 0, 0, 0, 0, 0, 1, 0].concat( 
                 new Array(5 - ( 
                     (user.fox < 6 && user.fox) || (user.fox > 5 && 5) || 0 
                 )).fill(0) 
             ), 
         }, 
         lost: { 
             health: 101 - user.cat * 4 
         } 
     } 
     return rewards 
 }
})
cmd({
pattern: "craft",
desc: "craftea varias herramientas con este comando",
category: 'rpg',
},
async (conn, m, { args }) => {
let repairs =  (args[0] || '').toLowerCase()
let user = global.db.data.users[m.sender] 
let caption = `
*Por alguna razon tienes estas recetas*
*(por un momento piensas crear una...)*
 
 *❏ Recetas*

*talvez un trabajo pida un hacha... nunca se sabe*
 ▧ Hacha 🪓
 〉4 madera
 〉3 hierro
 
*una buena decisión para conseguir materiales*
 ▧ Pico ⛏️ 
 〉 10 roca
 〉 5 Hierro 
 〉 2 madera

*necesitas pelear? esta es tu opcion*
 ▧ espada ⚔️ 
 〉 10 madera
 〉 15 hierro
 
*un poco de protección nunca viene mal*
 ▧ Armadura 🥼 
 〉 30 diamantes
 `
 switch (repairs) {

 case 'hacha': {
 if (user.axe > 0) return m.reply(`*te sientes estupido al intentar crear una hacha cuando ya tienes una...*\n(talvez querías mejorarlo con ${global.prefix}mejorar)`)
 if (user.wood < 4 || user.iron < 3) return m.reply(`*Te das cuenta que te faltan materiales...*\n(puedes intentar checar tu inventario con .inv)`)
 user.wood -= 4
 user.iron -= 3
 user.axe += 1
 user.axedurability = 70
 m.reply('*solo te cortaste una mano para tenér una fabulosa hacha 🪓*')
 }
 break
 
 case 'pico': {
 if (user.pickaxe > 0) return m.reply(`*te sientes estupido al intentar crear un pico cuando ya tienes uno...*\n(talvez querías mejorarlo con ${global.prefix}mejorar)`)
 if (user.rock < 10 || user.iron < 5 || user.wood < 2) return m.reply(`*Te das cuenta que te faltan materiales...*\n(puedes intentar checar tu inventario con .inv)`)
 user.rock -= 10
 user.iron -= 5
 user.wood -= 2
 user.pickaxe += 1
 user.pickaxedurability = 70
 m.reply('*crafteaste un pico ⚒️*')
 }
 break
 
 case 'espada': {
 if (user.pickaxe > 0) return m.reply(`*te sientes estupido al intentar crear una espada cuando ya tienes una...*\n(talvez querías mejorarlo con ${global.prefix}mejorar)`)
 if (user.wood < 10 || user.iron < 15) return m.reply(`*Te das cuenta que te faltan materiales...*\n(puedes intentar checar tu inventario con .inv)`)
 user.wood -= 10
 user.iron -= 15
 user.sword += 1
 user.sworddurability = 70
 m.reply('*con unas cuantas lesiones y cortaduras creaste una espada ⚔️*')
 }
 break
 
 case 'armadura': {
 if (user.armor > 0) return m.reply(`*te sientes estupido al intentar crear una armadura cuando ya tienes una...*\n(talvez querías mejorarlo con ${global.prefix}mejorar)`)
 if (user.diamond < 30) return m.reply(`*Te das cuenta que te faltan materiales...*\n(puedes intentar checar tu inventario con .inv)`)
 user.diamond -= 30
 user.armor += 1
 user.armordurability = 70
 m.reply('*como diablos hiciste una armadura con diaman.. da igual, lo bueno es que tienes ahora una armadura*')
 }
 break
 
 default: 
 m.reply(caption)
 }
 })
cmd({
pattern: "minar",
alias: ["mineria"],
desc: "minar como un malnacido por premios",
category: "rpg",
},
async (conn, m, { text, args }) => {
let cooldown = 10000
  let user = global.db.data.users[m.sender]
  let timer = (cooldown - (new Date - user.lastmining))
  if (user.health < 80) return conn.reply(m.chat, `*estas herido*\npara poder minar necesitas minimo 80 de *salud* ♥️\ncompra pociones con ${prefix}buy potion y curate con ${prefix}health`, m)
  if (user.pickaxe == 0) return m.reply('*quieres minar sin pico 💀*')
  if (user.pickaxedurability < 30) m.reply('*tu pico esta roto*')
  if (new Date() - user.lastmining < 10000) m.reply(`*estas demasiado cansado*\n*espera ${msToTime(cooldown - new Date())} para volver a minar*`)
  let rewards = reward(user)
  let txt = '*minaste demasiado*\n*pero a costa perdiste'
  for (let lost in rewards.lost) if (user[lost]) {
  let total= rewards.lost[lost].getRandom()
  user[lost] -= total * 1
  if (total) txt += `\n*${global.rpg.emoticon(lost)}:* ${total}`
  }
  txt += '\n\nPero consigues'
  for (let rewardItem in rewards.reward) if (rewardItem in user) {
  let total = rewards.reward[rewardItem].getRandom()
  user[rewardItem] += total * 1
  if (total) txt += `\n*${global.rpg.emoticon(rewardItem)}:* ${total}`
  }
  m.reply(txt.trim())
  user.lastmining = new Date * 1
  
  function reward(user = {}) {
  let rewards = {
  reward: {
  exp: 702 + user.level * 5000,
  trash: 103,
  string: 25,
  rock: 30,
  iron: 25,
  diamond: 5,
  emerald: 5,
  common: 2 * (user.dog && (user.dog > 2 ? 2 : user.dog) * 1.2 || 1), 
  uncommon: [0, 0, 0, 1, 0].concat(new Array(5 - ((user.dog > 2 && user.dog < 6 && user.dog) || (user.dog > 5 && 5) || 2 )).fill(0)), 
  },
  lost: {
  health: 80 - user.cat * 4,
  pickaxedurability: 30 - user.fox * 3
  }
  }
  return rewards
  }
})
cmd({
pattern: "health",
alias: ["curar", "curarme"],
desc: "curate de los daños de las aventuras",
category: "rpg",
}, 
async (conn, m, { args }) => {
  let user = global.db.data.users[m.sender]
  if (user.health >= 100) m.reply('*Tu salud esta llena ♥️*')
  let heal = 40 + user.cat * 4
  let count = Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, (isNumber(args[0]) && parseInt(args[0])) || Math.round((90 - user.health) / heal))) * 1
  if (user.potion < count) return m.reply(`*❌ No tienes pociónes*\n*necesitas ${count - user.potion} pocion para curarte*\n*Solo tienes ${user.potion}!!*`)
  user.potion -= count * 1 //1 potion = count (1) 
  user.health += heal * count
  m.reply(`*Tu salud esta completa ✅*\n*usaste ${count} pociones para curarte*\n*Nueva salud: ${user.health} ♥️*`)  
  function isNumber(number) { 
   if (!number) return number; 
   number = parseInt(number); 
   return typeof number == "number" && !isNaN(number); 
  }
})
cmd({
pattern: "inventario",
alias: ["inv", "inventory"],
desc: "checar el inventario",
category: "rpg",
},
async (conn, m) => {
let inventory = { 
   others: { 
     health: true, 
     money: true, 
     exp: true, 
     limit: true, 
     level: true, 
     role: true, 
   }, 
   items: { 
     potion: true, 
     trash: true, 
     wood: true, 
     rock: true, 
     string: true, 
     emerald: true, 
     diamond: true, 
     gold: true, 
     iron: true, 
     upgrader: true, 
     pet: true, 
   }, 
   durabi: { 
     sworddurability: true, 
     pickaxedurability: true, 
     axedurability: true,
     fishingroddurability: true, 
     armordurability: true,
   }, 
   tools: { 
     armor: { 
       '0': 'ropa desgastada', 
       '1': 'ropa comun', 
       '2': 'traje policial', 
       '3': 'traje militar', 
       '4': 'armadura antidisturbios', 
       '5': 'traje mecánico', 
       '6': 'traje legendario', 
       '7': 'armadura mejorada', 
       '8': 'armadura reforzada', 
       '9': 'armadura antimounstros', 
     }, 
     sword: { 
       '0': 'no tiene', 
       '1': 'espada inservible', 
       '2': 'espada desgastada',
       '3': 'espada de hierro',
       '4': 'doble espada afilada',
       '5': 'espada de oro', 
       '6': 'espada de oro reforzado', 
       '7': 'espada cazadora de mounstros',
     }, 
     pickaxe: { 
       '0': 'no tiene', 
       '1': 'pico quebradizo', 
       '2': 'pico desgastado', 
       '3': 'pico normal', 
       '4': 'pico de oro', 
       '5': 'pico de oro reforzado',
       '6': 'pico de diamante', 
       '7': 'pico de cristal'
     },
     axe: {
     '0': 'hacha normal',
     '1': 'hacha reforzada'
     },
     
     fishingrod: true, 
  
   }, 
   crates: { 
     common: true, 
     uncommon: true, 
     mythic: true, 
     legendary: true, 
   }, 
   pets: { 
     horse: 10, 
     cat: 10, 
     fox: 10, 
     dog: 10, 
   }
   } 
  let user = global.db.data.users[m.sender] 
  let tools = Object.keys(inventory.tools).map(v => user[v] && `${global.rpg.emoticon(v)} : ${typeof inventory.tools[v] === 'object' ? inventory.tools[v][user[v]?.toString()] : `nivel ${user[v]}`}`).filter(v => v).join('\n').trim() 
  let items = Object.keys(inventory.items).map(v => user[v] && `${global.rpg.emoticon(v)} : ${user[v]}`).filter(v => v).join('\n').trim() //`
  let dura = Object.keys(inventory.durabi).map(v => user[v] && `${global.rpg.emoticon(v)} : ${user[v]}`).filter(v => v).join('\n').trim() 
  let crates = Object.keys(inventory.crates).map(v => user[v] && `${global.rpg.emoticon(v)} : ${user[v]}`).filter(v => v).join('\n').trim() 
  let pets = Object.keys(inventory.pets).map(v => user[v] && `${global.rpg.emoticon(v)} : ${user[v] >= inventory.pets[v] ? 'nivel maximo' : `nivel ${user[v]}`}`).filter(v => v).join('\n').trim() //`
  let txt = `
👤 Nombre: ${await conn.getName(m.sender)}
🛡️ Rol ${user.role}

${Object.keys(inventory.others).map(v => user[v] && `➔ ${global.rpg.emoticon(v)} : ${user[v]}`).filter(v => v).join('\n')}${tools ? `
* Herramientas ⚔️*

${tools}` : ''}${dura ?`
${dura}` : ''}${items ? `

* Items ♦️*
${items}
Items totales: ${Object.keys(inventory.items).map(v => user[v]).reduce((a, b) => a + b, 0)} Items` : ''}${crates ? `

* Cajas 📦*
${crates}

Cajas totales:  ${Object.keys(inventory.crates).map(v => user[v]).reduce((a, b) => a + b, 0)} Cajas` : ''}${pets || user.petFood ? ` 

${pets ? pets + '\n' : ''}${user.petFood ? '🍖 comida para mascotas: ' + user.petFood : ''}` : ''}`.trim() // `
m.reply(txt)
})
 function sort(property, ascending = true) { 
   if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]; 
   else return (...args) => args[ascending & 1] - args[!ascending & 1]; 
 }
 cmd({
 pattern: "work",
 alias: ["chambear", "jalar", "trabajar"],
 desc: "trabaja por el sueldo mínimo!!",
 category: "rpg",
 },
 async (conn, m, { args }) => {
 const { pickRandom, msToTime } = require('../lib')
 let works = (args[0] || '').toLowerCase()
 let user = global.db.data.users[m.sender] 
 let txt = `
*Hola ${await conn.getName(m.sender)}*

*Aqui tienes una lista de trabajos donde puedes ser contratado*

 *Cajero 🏧*
- No necesitas nada para que te contraten el el cajero
- paga miserable 
- sin bonus exp

 *Leñador 🪵*
- necesitas un hacha (crafteable)
- paga buena
- bonus exp

 *Repartidor 🚚* (próximamente)
- Nivel 45 requerido
- Coche requerido
- Cada pedido 500 dolares
- Bonus xp
- Bonus items
`
switch (works) {

case 'cajero': {

let time = global.db.data.users[m.sender].lastwork + 600000  
if (new Date - global.db.data.users[m.sender].lastwork < 600000) return m.reply(`*Estas cansado*\n*Espera ${msToTime(time - new Date())} para volver a trabajar!!*`)
let pay = Math.floor(Math.random() * 300)
user.money += pay + user.dog * 1000
user.lastwork = new Date() * 1
let work = pickRandom(['los ruidos de lo clientes molestos no te dejan en paz, sin embargo tu paga fue de', 'fue una noche tranquila...\nganaste', 'porque elegiste este trabajo\n*esta pregunta retumba en tu cabeza*, sin embargo ganaste tu miseria de paga de'])
m.reply(`${work} ${pay} dólares 💵`)
}
break
case 'leñador':  {
let time = global.db.data.users[m.sender].lastwork + 600000  
if (new Date - global.db.data.users[m.sender].lastwork < 600000) return m.reply(`*Estas cansado*\n*Espera ${msToTime(time - new Date())} para volver a trabajar!!*`)
if (user.axe == 0) m.reply('*no fuistes contratado por la simple razon de que no tienes un hacha, subnormal*')
if (user.axedurability < 50) m.reply(`tu hacha puede *romperse* en esas condiciones sin aviso\npuedes reparar tu hacha con *${prefix}repair hacha*`)
let pay = pickRandom([900, 300, 700, 999])
let bonus = Math.floor(Math.random() * 3000)
let lost = Math.floor(Math.random() * 80)
user.money += pay + user.dog * 1000
user.exp += bonus + user.dog * 1000
user.lastwork = new Date() * 1
user.axedurability -= lost - user.fox * 4
let work = pickRandom(['este trabajo es demasiado bueno pero agotador, asi que este esfuerzo es recompensado por', '*piensas en cortar 20 troncos mas pero tu trabajo es tan bueno que ganas*'])
m.reply(`${work} ${pay + user.dog * 1000} dolares 💵\n*a costa de este trabajo ganaste ${bonus + user.dog * 1000} XP*\n*pero tu hacha perdio ${lost - user.fox * 4} de durabilidad*`)
}
break
default:

m.reply(txt)

}
})

cmd({
pattern: "petshop",
desc: "compra mascotas para tener habilidades especiales",
category: "rpg",
},
async (conn, m, { args }) => {
let shop = (args[0] || '').toLowerCase()
let user = global.db.data.users[m.sender] 
let hdog = 5000
let hcat = 5000
let hfox = 20000
let hpetfood = 1
let txt = `
*compra una mascota hoy...*

 🐈 • *Gato:*
 ➞ ${hcat} dolares
 ➞ 4% mas salud en cualquier accion
 
 
 🐕 • *Perro:* 
 ➞ ${hdog} dolares
 ➞ Bonus extra en dolares y xp (%400)
 
 
 🦊 • *Zorro:*  (próximamente)
 ➞ ${hfox} dolares
 ➞ bonus en ataques 
 ➞ Los cooldown se rebajan 30 segundos
 
 🍖 • *Comida para mascotas*:
  ➞ ${hpetfood} Pet token
  ➞ Sube de nivel tus mascotas
`

switch (shop) {
case 'gato': {
if (user.cat) return m.reply('ya tienes esa mascota!!')
if (user.money < hdog) return m.reply('te falta dinero!!')
user.money -= hdog
user.cat += 1
m.reply('*gracias por comprar a este lindo gatito*\n*(la curacion de vida sube un %4)*')
}
break
case 'perro': {
if (user.dog) return m.reply('ya tienes esa mascota!!')
if (user.money < hdog) return m.reply('te falta dinero!!')
user.money -= hdog
user.dog += 1
m.reply('*gracias por adoptar a un lindo perro*\n*(desde ahora las ganancias se duplicaran)*')
}
break
case 'zorro': {
if (user.fox) return m.reply('ya tienes esa mascota!!')
if (user.money < hfox) return m.reply('te falta dinero!!')
user.money -= hfox
user.fox += 1
m.reply('*gracias por adoptar a un zorro*\n*(bonus de ataque, cooldowns reducidos)*')
}
break
default: 
m.reply(txt)
}})

cmd({
pattern: "reparar",
alias: ["repair"],
desc: "reparar tus items",
category: "rpg",
},
async (conn, m, { args }) => {
let repairs =  (args[0] || '').toLowerCase()
let user = global.db.data.users[m.sender] 
let caption = `
*una hoja arrugada con recetas para reparar*

 *❏ Recetas*
 
*estas simples dos piedras y un poco de hierro*
*afilara tu hacha*
 ▧ Hacha 🪓
 〉2 roca
 〉2 hierro
 
 *un poco de hierro y madera hacen la diferencia*
 ▧ Pico ⛏️ 
 〉2 madera
 〉2 hierro
`

switch (repairs) {
case 'hacha': {
 if (user.axe < 0) return m.reply('*primero crea un hacha, genio*')
 if (user.rock < 2|| user.iron < 2)  return conn.sendNyanCat(m.chat, '*te faltan materiales para craftear esto*', global.menu2, '[ I N F O ]', 'SIN MATERIALES', m)
 user.rock -= 2
 user.iron -= 2
 user.axedurability = 100
 m.reply('*porque puedes reparar esto...*\n*la logica vale verga porque acabas de reparar tu hacha!!*')
 }
 break
 
 case 'pico': {
 if (user.pickaxe < 0) return m.reply('*primero crea un pico, genio*')
 if (user.iron < 5 || user.wood < 2) return conn.sendNyanCat(m.chat, '*te faltan materiales para craftear esto*', global.menu2, '[ I N F O ]', 'SIN MATERIALES', m)
 user.pickaxedurability = 100
 m.reply('*Bien, te acabas de reparar tu pico a madrazos. dejandolo como nuevo ⚒️*')
 }
 break
default:
conn.reply(m.sender, caption, fkontak)
}
})
cmd({
pattern: "claim",
alias: ["reclamar"],
desc: "reclama tu recompensa diaria",
category: "rpg",
},
async (conn, m) => {
let { msToTime } = require('../lib')
let user = global.db.data.users[m.sender]
let rewards = {
exp: 9999 + user.dog * 1000,
money: 3000 + user.dog * 2000,
potion: 5 + user.cat * 4,
wood: 10,
diamond: 9,
iron: 12
} 
let cooldown = user.lastclaim + 86400000 - user.fox * 30
if (new Date - user.lastclaim < 86400000) return m.reply(`*❗ Ya reclamaste tu cofre diario*\n*espera ${msToTime(cooldown - new Date())} para volver a reclamar este cofre*`)
let txt = ''
for (let reward of Object.keys(rewards)) {
if (!(reward in user)) continue
user[reward] += rewards[reward]
txt += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}\n`
}
conn.reply(m.chat, '*HAS CONSEGUIDO 🥳*\n' + txt, global.fkontak)
user.lastclaim = new Date() * 1
})
cmd({
pattern: "transfer",
alias: ["transferir", "dar"],
desc: "transfiere a la gente",
category: "rpg",
use: "@user",
},
async (conn, m, { text, body, args}) => {
let items = ['money', 'exp', 'limit', 'potion']
    this.confirm = this.confirm ? this.confirm : {}
    if (this.confirm[m.sender]) return conn.sendText(m.chat, `*❗ Aun hay una tranferencia, Espera a que acabe esa transferencia*`, m)
    let user = global.db.data.users[m.sender]
    let item = items.filter((v) => v in user && typeof user[v] == 'number')
    let lol = `*Creo que no sabes usar bien este comando -_-*\n*te dare un ejemplo porque me caes bien ^w^*\n${global.prefix + cmd.pattern} exp 100 @0\n📍 Algunos articulos *Disponibles son*:\nexp\nmoney\nlimit\npotion`
    let type = (args[0] || '').toLowerCase()
    if (!item.includes(type)) return conn.sendTextWithMentions(m.chat, lol, m)
    let count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
    if (!(who in global.db.data.users)) m.reply('*El usuario no esta registrado en mi base de datos :(*')
    if (user[type] * 1 < count) m.reply(`no tienes suficiente *${type}*`)
    let confirm = `*estas seguro de transferir ${count}?*\ntienes solamente *60 segundos*\nelige una opción\nsi = transferir ${count}\nno = cancelar`
    await m.reply(confirm)
    this.confirm[m.sender] = {
    sender: m.sender,
    to: who,
    message: m, type, count,
    timeout: setTimeout(() => (m.reply(`*❗ se acabo el tiempo*\n*la transacción se canceló 😓*`), delete this.confirm[m.sender]), 60 * 1000)
    }
})   
cmd({
pattern: "transfer",
alias: ["transferir"],
desc: "transfierere a alguien",
use: "@tag",
category: "rpg",
},
async (conn, m, { args }) => {
this.bet = this.bet ? this.bet : {}
   if (m.sender in this.bet) throw '¡¡Todavía estás apostando, espera hasta que se acabe!!'
   try { 
   let user = global.db.data.users[m.sender]
   let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1 
   if ((user.money * 1) < count) return m.reply('¡¡No tienes suficiente dinero!!')
   if (!(m.sender in this.bet)) {
   this.bet[m.sender] = {
   sender: m.sender,
   count,
   timeout: setTimeout(() => (m.reply('*se acabo el tiempo*'), delete this.bet[m.sender]), 60000)
   }
   let txt =`¿Estás seguro de que quieres apostar? (si/no)\n\n*Apuesta:* ${count} 💵\n*⏰ Tienes 60 segundos para tomar una decisión*`
   return conn.reply(m.chat, txt, m)
   }
   } catch (e) {
   console.error(e)
   if (m.sender in this.bet) {
   let { timeout } = this.bet[m.sender]
   clearTimeout(timeout)
   delete this.bet[m.sender]
   m.reply('*No elegiste nada*\n*apuesta rechazada*')
   }
   }
})

cmd({ on: "all" }, async (conn, m, { args }) => {
    let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of mentionUser) {
  let user = global.db.data.users[jid]
  if (!user) continue
  let afkTime = user.afkTime
  if (!afkTime || afkTime < 0) continue
  let reason = user.afkReason || ''
  m.reply(`*❗ No lo etiquetes*\n*El esta afk ${reason ? 'por la razon ' + reason : 'Sin ninguna razon -_-'}*\nDurante ${clockString(new Date - afkTime)}`.trim())
  }
  if (global.db.data.users[m.sender].afkTime > -1) {
  let user = global.db.data.users[m.sender]
  m.reply(`*❗Dejaste de estar afk ${user.afkReason ? 'Por ' + user.afkReason : ''}*\n*Durante ${clockString(new Date - user.afkTime)} ^_^*`.trim())
  user.afkTime = -1
  user.afkReason = ''
  }
})
cmd({ on: "text" }, async (conn, m, { text, args, body }) => {
this.bet = this.bet ? this.bet : {}
  if (m.sender in this.bet) {
     if (m.isBaileys) return 
     let { timeout, count } = this.bet[m.sender] 
     let user = global.db.data.users[m.sender] 
     let beforemoney = user.money * 1 
     try {
         if (/^(Si|si|sí)?$/i.test(m.text)) { 
             let Bot = (Math.ceil(Math.random() * 91)) * 1 
             let you = (Math.floor(Math.random() * 71)) * 1 
             let status = 'perdiste'
             if (Bot < you) { 
                 user.money += count * 1 + user.dog * 2000
                 user.exp += count * 100 + user.dog * 5000
                 status = 'ganaste'
             } else if (Bot > you) { 
                 user.money -= count * 1 
             } else { 
                 status = 'empataste'
                 user.money += (Math.floor(count / 1.5)) * 1 
             } 
             m.reply(` 
 | *JUGADOR* | *PUNTOS* | 
 *🤖 BOT:*   ${Bot} 
 *👤 TU:*    ${you} 
  
 *tu ${status}*, tu ${status == 'ganaste' ? `Conseguiste *+${count * 2}*` : status == 'perdiste' ? `Perdiste *-${count * 1}*` : `Conseguiste *+${Math.floor(count / 1.5)}*`} dolares`.trim()) //`//`
             clearTimeout(timeout) 
             delete this.bet[m.sender] 
             return !0 
         } else if (/^(✖️|no)?$/i.test(txt)) { 
             clearTimeout(timeout) 
             delete this.bet[m.sender] 
             m.reply('Rejected') 
             return !0 
         } 
  
     } catch (e) { 
         clearTimeout(timeout) 
         delete this.bet[m.sender] 
         if (beforemoney > (user.money * 1)) user.money = beforemoney * 1 
         m.reply('(Rejected)') 
         return !0 
     } finally { 
         clearTimeout(timeout) 
         delete this.bet[m.sender] 
         return !0 
     }}
})

cmd({
pattern: "levelup",
category: "rpg",
}, async (conn, m) => {
let name = await conn.getName(m.sender); 
    let user = global.db.data.users[m.sender]; 
   if (!canLevelUp(user.level, user.exp, global.multiplier)) { 
     let {min, xp, max} = xpRange(user.level, global.multiplier); 
     throw ` 
 ┌───⊷ *NIVEL* 
 ▢ Nombre : *${await conn.getName(m.sender)}* 
 ▢ Nivel : *${user.level}* 
 ▢ XP : *${user.exp - min}/${xp}* 
 ▢ Rango : *${user.role}*
 └────────────── 
  
 Te falta *${max - user.exp}* de *XP* para subir de nivel 
 `.trim(); 
   } 
   let before = user.level * 1; 
   while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++; 
   if (before !== user.level) {
   let bonus = Math.ceil(50 * user.level)
   user.money += bonus
   let strt = `.             ${user.role}`
   let str = ` 
 ┌─⊷ *LEVEL UP* 
 ▢ Nivel anterior : *${before}* 
 ▢ Nivel actual : *${user.level}* 
 ▢ Bonus: *+${bonus} dolares*
 └────────────── 
  
 *_Cuanto más interactúes con los bots, mayor será tu nivel_* 
 `.trim()
 throw str
 //let image = await levelup(strt, user.level)
 //conn.sendMessage(m.chat, { image: image, caption: str }, {quoted: m})
 }    
})
cmd({
pattern: "perfil",
category: "rpg",
}, async (conn, m) => {
avatar = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
   let { money, exp, role, limit, level, health, potion } = global.db.data.users[who]
   conn.sendMessage(m.chat, { image: { url: avatar }, caption: `*Perfil de ${await conn.getName(who)}*\n*♥️ Salud: ${health}*\n*⚔️ Rol: ${role}*\n*⬆️ Nivel: ${level}*\n*✨ Exp: ${exp}*\n*💵 Dinero: ${money}*\n*💎 Diamantes: ${limit}*\n*🥤 Pocion: ${potion}*`}, { quoted: fkontak })
})

cmd({ 
pattern: "afk",
category: "rpg",
},
async (conn, m, { text }) => {
   let user = global.db.data.users[m.sender]
   user.afkTime = + new Date
   user.afkReason = text
   m.reply(`*Esta bien ${m.pushName}...*\n les dire a los que te etiqueten que estas *AFK* ${text ? 'por ' + text : 'sin razon'} nwn`)
})
cmd({ on: "all" }, async (m) => {
let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
for (let jid of mentionUser) {
let user = global.db.data.users[jid]
if (!user) continue
let afkTime = user.afkTime
if (!afkTime || afkTime < 0) continue
let reason = user.afkReason || ''
m.reply(`este usuario esta inactivo \n\n${reason ? 'por la razon: ' + reason : 'sin razon'}\n*estuvo inactivo por* ${clockString(new Date - afkTime)}`.trim())}
if (global.db.data.users[m.sender].afkTime > -1) {
let user = global.db.data.users[m.sender]
m.reply(`*🕔 dejaste de estar afk 🕔*
${user.afkReason ? '\n*razon :* ' + user.afkReason : ''}\n*estuvo inactivo por:* ${clockString(new Date - user.afkTime)}`.trim())
user.afkTime = -1
user.afkReason = ''
}
})

cmd({ on: "text" }, async (conn, m, { text, body }) => {
this.confirm = this.confirm ? this.confirm : {}
  if (this.confirm[m.sender]) {
  let { timeout, sender, message, to, type, count } = this.confirm[m.sender]
  let user = global.db.data.users[sender]
  let _user = global.db.data.users[to]
  if (/^No|no$/i.test(body)) {
  clearTimeout(timeout)
  delete this.confirm[sender]
  return this.sendTextWithMentions(m.chat, `@${sender.split("@")[0]} *cancelo la transferencia*`, m)
  }

  if (/^Si|si$/i.test(m.text)) { 
   let previous = user[type] * 1
   let _previous = _user[type] * 1
   user[type] -= count * 1
   _user[type] += count * 1
   if (previous > user[type] * 1 && _previous < _user[type] * 1) {
   conn.sendMessage(m.chat, {text: `*[❗] Se transfirierón correctamente ${count} ${type} a @${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, mentions: [to]}, {quoted: m}); 
     } else { 
       user[type] = previous; 
       _user[type] = _previous; 
       conn.sendMessage(m.chat, {text: `*[❗] Error al transferir ${count} ${type} a @${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, mentions: [to]}, {quoted: m}); 
     } 
     clearTimeout(timeout); 
     delete this.confirm[sender]; 
   }
  }
})






 function toNumber(property, _default = 0) { 
   if (property) { 
     return (a, i, b) => { 
       return {...b[i], [property]: a[property] === undefined ? _default : a[property]}; 
     }; 
   } else return (a) => a === undefined ? _default : a; 
 } 
  
 function enumGetKey(a) { 
   return a.jid; 
 }
function isNumber(x) { 
    return !isNaN(x); 
    }
/** 
  * Detect if thats number 
  * @param {Number} x  
  * @returns Boolean 
  */ 
   function number(x = 0) { 
     x = parseInt(x) 
     return !isNaN(x) && typeof x == 'number' 
 }

let file = require.resolve(__filename)  
  fs.watchFile(file, () => {  
  fs.unwatchFile(file)  
  console.log(`Update ${__filename}`)
  delete require.cache[file]  
  require(file)  
  })