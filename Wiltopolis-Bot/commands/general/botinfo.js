const Discord = require("discord.js");
const ms = require("parse-ms")
let dateFormat = require("dateformat")
module.exports.run = async (bot, message, args) => {
  const timeObj = ms(bot.uptime)
  const botembed = new Discord.MessageEmbed()
    .setAuthor(bot.user.username, bot.user.avatarURL())
    .setColor("#056EF7")
    .addField("Creator", "HeadTriXz#7760")
    .addField("Created On", dateFormat(bot.user.createdAt, "ddd, mmm dd, yyyy h:MM TT"))
    .addField("Updater", "Wilted#3634")
    .addField("Updated On", dateFormat(bot.user.lastModified, "ddd, mmm dd, yyyy"))
    .addField("Version", "v1.0.1")
    .addField("Discord", `[https://wedesign.com/invite](https://discord.gg/CFdS3By)`)
    .addField("Youtube", `[https://wiltedofficials.com](https://youtube.com/WiltedOfficials)`)
    .addField("Uptime", `${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s`)

  message.channel.send(botembed);
}

module.exports.help = {
  name: "botinfo",
  aliases: ["info"],
  description: 'Displays the bot information.',
  usage: '',
  category: 'general'
}
