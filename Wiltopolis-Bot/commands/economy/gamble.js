const Discord = require("discord.js");
const errors = require("../../utils/errors.js");
let config = require("../../config.json");
let ms = require("parse-ms");
let db = require('quick.db')
let currencyFormatter = require('currency-formatter')
let cooldown = 300000;
let cooldown2 = 1209600000
module.exports.run = async (bot, message, args) => {

  let lastGamble = bot.lastGamble.get(`${message.author.id}-${message.guild.id}`)
  let score = await bot.getScore(message.author.id, message.guild.id);

  if (lastGamble && cooldown - (Date.now() - lastGamble.time) > 0) {
    let timeObj = ms(cooldown - (Date.now() - lastGamble.time))

    let lastGambleEmbed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, message.author.avatarURL())
      .setColor(`#ff4d4d`)
      .setDescription(`You can not use that command for another **${timeObj.minutes}m** **${timeObj.seconds}s**!`)
    message.channel.send(lastGambleEmbed)
  } else {


    let boost = await bot.getBoost(message.author.id, message.guild.id)
    let money = parseInt(args[0]);
    let random = Math.round(Math.random());

    if (!boost) {
      boost = {
        user: message.author.id,
        guild: message.guild.id,
        time: { coins: null, xp: null },
        multiplier: { coins: 1, xp: 1 }
      };
    }


    function isOdd(num) {
      if ((num % 2) == 0) return false;
      else if ((num % 2) == 1) return true;
    }
    if (!args[0]) return errors.custom(message, "Please, Select an amount of coins.")
    if (args[0] != parseInt(args[0])) return errors.custom(message, `The number **${args[0]}** is not a valid number!`);
    if (money <= 0) return errors.custom(message, "You can not gamble zero or less coins!")
    if (parseInt(args[0]) > score.coins) return errors.custom(message, "You can not gamble more than you have!")
    if (money > 250) return errors.custom(message, "You can not gamble more than 200 coins!");

    const userlost = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setDescription(`You have lost **${money}** coins!\n\u200B\nYou now have **${score.coins - money}** coins!`)
      .setColor("#e74c3c")

    if (!isOdd(random)) {
      score.coins -= money;
      message.channel.send(userlost)
    }

    const userwon = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setDescription(`You have won **${money}** coins!\n\u200B\nYou now have **${score.coins + money}** coins!`)
      .setColor("#2ae04f")

    if (boost.time.coins !== null && cooldown2 - (Date.now() - boost.time.coins) > 0) {
      money = parseInt(money * boost.multiplier.coins)
      userwon.setFooter(`You have won an additional ${parseInt(money)} coins due to your Coin Booster!`)
    }


    if (isOdd(random)) {
      score.coins += money;
      message.channel.send(userwon)
    }
    bot.lastGamble.set(`${message.author.id}-${message.guild.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      time: Date.now()
    });
    bot.setScore(score);
  }
}

module.exports.help = {
  name: "gamble",
  aliases: [],
  description: 'Allows you to gamble your coins.',
  usage: '[amount]',
  category: 'economy'
}
