const Discord = require("discord.js");
const errors = require("../../utils/errors.js");
let ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {
  let timeObj = ms(bot.uptime)

  let uptimeEmbed = new Discord.MessageEmbed()
    .setAuthor(`Bot Uptime`, bot.user.avatarURL())
    .setDescription(`The bot has been running for **${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s**`)
    .setColor("#056EF7")

  message.channel.send(uptimeEmbed)
}

module.exports.help = {
  name: "uptime",
  aliases: [],
  description: '',
  usage: '',
  category: 'general'
}
