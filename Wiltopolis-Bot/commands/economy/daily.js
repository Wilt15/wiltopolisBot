const Discord = require("discord.js");
const errors = require("../../utils/errors.js");
let currencyFormatter = require('currency-formatter')
var db = require('quick.db')
var ms = require('parse-ms');

module.exports.run = async (bot, message, args) => {
  let cooldown = 8.64e+7; // Cooldown Daily
  let amount = 25; // Daily Payout
  let score = await bot.getScore(message.author.id, message.guild.id);

  let lastDaily = await db.fetch(`lastDaily_${message.author.id}_${message.guild.id}`)

  if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
    let timeObj = ms(cooldown - (Date.now() - lastDaily))

    let lastDailyEmbed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, message.author.avatarURL())
      .setColor(`#ff4d4d`)
      .setDescription(`You can not use that command for another **${timeObj.hours}h ${timeObj.minutes}m** **${timeObj.seconds}s**!`)
    message.channel.send(lastDailyEmbed)

  } else {
    db.set(`lastDaily_${message.author.id}_${message.guild.id}`, Date.now());
    score.coins += 25

    let daily = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, message.author.avatarURL())
      .setColor("#4bd868")
      .setDescription("You have claimed your daily bonus of 25 coins!")

    message.channel.send(daily)
    bot.setScore(score);
  }
}

module.exports.help = {
  name: "daily",
  aliases: [],
  description: 'Get your daily coins.',
  usage: '',
  category: 'economy'
}
