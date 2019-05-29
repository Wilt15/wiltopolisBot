const Discord = require("discord.js");
const errors = require("../../utils/errors.js");
const ms = require("parse-ms");
let currencyFormatter = require('currency-formatter')
let cooldown = 300000;
let cooldown2 = 1209600000
module.exports.run = async (bot, message, args) => {
    function isOdd(num) {
      if ((num % 2) == 0) return false;
      else if ((num % 2) == 1) return true;
    }

    if (args[0] === "accept") {
      const lastFlip = bot.lastCoinflip.get(`${message.author.id}-${message.guild.id}`)
      if (lastFlip && 60000 - (Date.now() - lastFlip.time) > 0 && lastFlip.user2 === message.author.id) {
        const random = Math.round(Math.random());
        const random2 = Math.round(Math.random());

        var sides = ["Heads", "Tails"]
        const side = sides[random]
        const side2 = sides[~random & 1]
        var sides2 = [sides[random], sides[~random & 1]]

        const users = [lastFlip.user1.toString(), lastFlip.user2.toString()]
        const wside = sides2[random2];
        const winner = bot.users.get(users[random2])
        const loser = bot.users.get(users[~random2 & 1])

        let pCoins = await bot.getScore(winner.id, message.guild.id);
        let sCoins = await bot.getScore(loser.id, message.guild.id);

        let sidesEmbed = new Discord.MessageEmbed()
          .setAuthor("Coinflip", bot.user.avatarURL())
          .setDescription(`<@${lastFlip.user1}>, you are ${side}.\n<@${lastFlip.user2}>, you are ${side2}.`)
          .setColor("#4286f4")

        let winEmbed = new Discord.MessageEmbed()
          .setAuthor(winner.username, winner.avatarURL())
          .setDescription(`${wside}! ${winner} has won the coinflip! ${lastFlip.bet} coins have been added to your balance`)
          .setColor("#4bd868")

        pCoins.coins += lastFlip.bet;
        sCoins.coins -= lastFlip.bet;

        message.channel.send(sidesEmbed)
        message.channel.send(winEmbed)

        bot.setScore(pCoins);
        bot.setScore(sCoins);
        bot.lastCoinflip.delete(`${message.author.id}-${message.guild.id}`)
        return;
      } else {

        let noCF = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.avatarURL())
          .setDescription("You are currently not challenged.")
          .setColor("#ff4d4d")

        message.channel.send(noCF)
        return;
      }
    } else if (args[0] === "decline") {
      const lastFlip = bot.lastCoinflip.get(`${message.author.id}-${message.guild.id}`)
      if (lastFlip && 60000 - (Date.now() - lastFlip.time) > 0) {
        bot.lastCoinflip.delete(`${message.author.id}-${message.guild.id}`)
        return;
      } else {

        let noCF = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.avatarURL())
          .setDescription("You are currently not challenged.")
          .setColor("#ff4d4d")

        message.channel.send(noCF)
        return;
      }
    }
    const lastFlip = bot.lastCoinflip.get(`${message.author.id}-${message.guild.id}`)
    if (lastFlip && cooldown - (Date.now() - lastFlip.time) > 0) {
      let timeObj = ms(cooldown - (Date.now() - lastFlip.time))

      let lastFlipEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor(`#ff4d4d`)
        .setDescription(`You can not use that command for another **${timeObj.minutes}m** **${timeObj.seconds}s**!`)
      message.channel.send(lastFlipEmbed)
    } else {

    const member = message.mentions.members.first()
    const lastFlip = bot.lastCoinflip.get(`${message.author.id}-${message.guild.id}`)

    if (!member) return errors.cantfindUser(message);
    if (member.user.id === message.author.id) return errors.custom(message, "You can't flip a coin with yourself.");
    if (!args[1]) return errors.custom(message, "Please, Select an amount of coins.")
    if (args[1] != parseInt(args[1])) return errors.custom(message, `The number **${args[1]}** is not a valid number!`);
    if (parseInt(args[1]) <= 0) return errors.custom(message, "You can't bet zero or less coins!")

    const pCoins = await bot.getScore(member.user.id, message.guild.id);
    const sCoins = await bot.getScore(message.author.id, message.guild.id);

    if (!pCoins) {
      pCoins = {
        id: `${message.guild.id}-${member.user.id}`,
        user: member.user.id,
        guild: message.guild.id,
        points: 0,
        level: 0,
        coins: 0
      }
    }
    if (!sCoins) {
      sCoins = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 0,
        coins: 0
      }
    }

    if (parseInt(args[1]) > sCoins.coins) return errors.custom(message, "You can't bet more than you have!")
    if (parseInt(args[1]) > pCoins.coins) return errors.custom(message, `You can't bet more than <@${member.user.id}> has!`)
    //if (money > 500) return errors.custom(message, "You can't bet more than 200 coins!")

    if (lastFlip && 60000 - (Date.now() - lastFlip.time) > 0) return errors.custom(message, "You already challanged someone!")
    let chall = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setDescription(`You have successfully challenged ${member.user.username} to a coinflip!`)
      .setColor("#4bd868")


    let challanged = new Discord.MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL())
      .setDescription(`You have been challenged to a coinflip by ${message.author.username} for ${parseInt(args[1])} coins! To agree type \`${bot.guildConf.prefix}coinflip accept\` or to decline type \`${bot.guildConf.prefix}coinflip decline\``)
      .setFooter(`You have 60 seconds to accept or decline, before it expires!`)
      .setColor("#4286f4")

    message.channel.send(chall)
    message.channel.send(challanged)

    const object = {
        time: Date.now(),
        guild: message.guild.id,
        user1: message.author.id,
        user2: member.user.id,
        bet: parseInt(args[1])
      }

    bot.lastCoinflip.set(`${member.user.id}-${message.guild.id}`, object)
    }
  }

module.exports.help = {
  name: "coinflip",
  aliases: ["cf", "flip"],
  description: 'Allows you to challenge another user to a coinflip.',
  usage: '[user] [amount]',
  category: 'economy'
}
