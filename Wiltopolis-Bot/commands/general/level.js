const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("../../config.json");
const MongoClient = require("mongodb").MongoClient;
const ms = require("parse-ms");
const currencyFormatter = require('currency-formatter')
const {
  createCanvas,
  loadImage
} = require('canvas')
const errors = require("../../utils/errors.js");
const fs = require('fs')

module.exports.run = async (bot, message, args) => {
const canvas = createCanvas(934, 282)
const ctx = canvas.getContext('2d')
MongoClient.connect(process.env.MONGODB_URI,
  {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 5000,
    ssl: true,
    sslValidate: false,
    useNewUrlParser: true
  }, async function(err, client) {
const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args.join(" ")) || message.guild.members.get(args[0]) || message.member
const xpBoost = await bot.getBoost(member.user.id, message.guild.id)
const score = await bot.getScore(member.user.id, message.guild.id);
  if (!score) {
    score = {
      id: `${message.guild.id}-${member.id}`,
      user: member.id,
      guild: message.guild.id,
      points: 0,
      level: 0,
      coins: 0
    }
  };
  const getdiff = Math.floor(5 * (score.level * score.level) + 50 * score.level + 100)
  const diff = Math.floor(5 / 6 * score.level * (2 * score.level * score.level + 27 * score.level + 91))
  const curLevel = Math.floor(5 / 6 * (score.level + 1) * (2 * (score.level + 1) * (score.level + 1) + 27 * (score.level + 1) + 91))
  const img = await loadImage(member.user.avatarURL({format: "png", size: 1024}));
  const img2 = await loadImage("https://i.imgur.com/eS4IxK3.png")
  const xpboostperc = ((1209600000-(Date.now()-xpBoost)) * 100 / 1209600000)

  var arr = await client.db("scores").collection("scores").find({guild: message.guild.id}).toArray();
  const ranking = arr.sort(function(a, b){return b.points-a.points}).findIndex(x => x.user == member.user.id) + 1;
  function nFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
    }
    return num;
  }
  ctx.beginPath
  ctx.fillStyle = "#23272A";
  ctx.fillRect(0, 0, 934, 282);

  ctx.fillStyle = "#7289DA";
  ctx.fillRect(0, 0, 141, 282);
  ctx.beginPath()
  ctx.fillStyle = '#99AAB5'
  ctx.font = "25px Helvetica";
  ctx.fillText("LEVEL", 270, 80);
  ctx.fillStyle = "#ffffff"
  ctx.font = "40px Helvetica";
  ctx.fillText(score.level, 360, 80);

  ctx.fillStyle = '#99AAB5'
  ctx.font = "25px Helvetica";
  ctx.fillText("TOTAL XP", 360 + 50 + score.level.toString().length * 20, 80);
  ctx.fillStyle = "#ffffff"
  ctx.font = "40px Helvetica";
  ctx.fillText(nFormatter(score.points), 360 + 50 + score.level.toString().length * 20 + 130, 80);

  const width2 = 875 - ctx.measureText("#" + ranking).width;

  ctx.textAlign = "end";
  ctx.fillStyle = '#99AAB5'
  ctx.font = "25px Helvetica";
  ctx.fillText("RANK", width2, 80);
  ctx.fillStyle = "#ffffff"
  ctx.font = "40px Helvetica";
  ctx.fillText(`#` + ranking, 895, 80);
  ctx.textAlign = "start";
  ctx.font = "30px Helvetica"
  const width = ctx.measureText(`${nFormatter(score.points - diff)} / ${nFormatter(getdiff)} XP`).width + 50 + ctx.measureText(`#${member.user.discriminator}`).width + 10 + 270;
  ctx.font = "42px Helvetica"
  const width1 = ctx.measureText(LimitText(member.user.username, 895 - width)).width;
  ctx.fillText(LimitText(member.user.username, 895 - width), 270, 200)

  ctx.fillStyle = '#99AAB5'
  ctx.font = "30px Helvetica"
  ctx.fillText(`#${member.user.discriminator}`, 270 + 10 + width1, 200)

  ctx.font = "30px Helvetica"
  ctx.textAlign = "end";
  ctx.fillText(`${nFormatter(score.points - diff)} / ${nFormatter(getdiff)} XP`, 895, 200)
  ctx.textAlign = "start";
  const perc = (((score.points - diff) * 100 / getdiff) / 100)

  ctx.beginPath()
  ctx.lineCap = "round";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#ffffff";
  ctx.moveTo(278, 230);
  ctx.lineTo(895, 230);
  ctx.stroke()

  ctx.beginPath()
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#7289DA";
  ctx.moveTo(278, 230);
  ctx.lineTo(278 + 620 * perc, 230);
  ctx.stroke()
  ctx.lineCap = "butt"

  ctx.beginPath()
  ctx.arc(141, 141, 100, 0, 2 * Math.PI, false)
  ctx.fillStyle = "#23272A";
  ctx.fill()

  ctx.save()

  ctx.beginPath()
  ctx.arc(141, 141, 95, 0, 2 * Math.PI, false)
  ctx.clip();
  ctx.drawImage(img, 41, 41, 200, 200);

  ctx.beginPath()
  ctx.arc(141, 141, 100, 0, 2 * Math.PI, false);
  ctx.lineWidth = 15
  ctx.strokeStyle = '#23272A'
  ctx.stroke()

  ctx.restore()

  if (member.user.presence.status === "online") ctx.drawImage(await loadImage('https://i.ibb.co/0ykgM6M/status-online.png'), 185, 185, 50, 50);
  if (member.user.presence.status === "idle") ctx.drawImage(await loadImage('https://i.ibb.co/dtyN9fB/status-idle.png'), 185, 185, 50, 50);
  if (member.user.presence.status === "dnd") ctx.drawImage(await loadImage('https://i.ibb.co/DMXH8qN/status-dnd.png'), 185, 185, 50, 50);
  if (member.user.presence.activity && member.user.presence.activity.type === "STREAMING") ctx.drawImage(await loadImage('https://i.ibb.co/hWDDp3J/status-streaming.png'), 185, 185, 50, 50);
  if (member.user.presence.status === "offline") ctx.drawImage(await loadImage('https://i.ibb.co/k5VRYV1/status-offline.png'), 185, 185, 50, 50);

  message.channel.send({
    files: [{
      attachment: canvas.toBuffer(),
      name: `${member.user.username}_level.png`
    }]
  })
client.close()
});
function LimitText (text, limit) {
  while(ctx.measureText(text).width > limit) text = text.substring(0, text.length - 1);
  return text;
}
}
module.exports.help = {
  name: "level",
  aliases: ["rank"],
  description: 'View yours or someone else\'s current level.',
  usage: '<user>',
  category: 'general'
}
