const Discord = module.require("discord.js");
const errors = require("../../utils/errors.js");
const config = require("../../config.json");
const bot = new Discord.Client();
var ms = require("parse-ms");
var db = require('quick.db')
const currencyFormatter = require('currency-formatter')
const cooldown2 = 300000;
const cooldown = 1209600000

function isOdd(num) {
  if ((num % 2) == 0) return false;
  else if ((num % 2) == 1) return true;
}

module.exports.run = async (bot, message, args) => {
  const lastRoulette = bot.lastRoulette.get(`${message.author.id}-${message.guild.id}`)
  let score = await bot.getScore(message.author.id, message.guild.id);

  if (lastRoulette && cooldown2 - (Date.now() - lastRoulette.time) > 0) {
    let timeObj = ms(cooldown2 - (Date.now() - lastRoulette.time))

    let lastRouletteEmbed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, message.author.avatarURL())
      .setColor(`#ff4d4d`)
      .setDescription(`You can not use that command for another **${timeObj.minutes}m** **${timeObj.seconds}s**!`)
    message.channel.send(lastRouletteEmbed)
  } else {

    if (args[1] != parseInt(args[1])) return errors.custom(message, `The number **${args[1]}** is not a valid number!`);

    let colour = args[0];
    let money = parseInt(args[1]);
    let boost = await bot.getBoost(message.author.id, message.guild.id)

    if (!boost) {
      boost = {
        user: message.author.id,
        guild: message.guild.id,
        time: { coins: null, xp: null },
        multiplier: { coins: 1, xp: 1 }
      };
  }

    if (!money) return errors.custom(message, "Please, Select an amount of coins.");
    if (!colour) return errors.custom(message, "You can only bet on Black (1x), Red (1x), or Green (5x).");
    if (money > 250) return errors.custom(message, "You can not bet more than 250 coins!");
    if (money <= 0) return errors.custom(message, "You can not gamble zero or less coins!")
    if (money > score.coins) return errors.custom(message, "Sorry, you are betting more than you have!");
    colour = colour.toLowerCase()

    if (colour == "b" || colour.includes("black")) colour = "Black";
    else if (colour == "r" || colour.includes("red")) colour = "Red";
    else if (colour == "g" || colour.includes("green")) colour = "Green";
    else return errors.custom(message, "You can only bet on Black (1x), Red (1x), or Green (5x).");

    let random = Math.floor(Math.random() * 37);
    db.set(`lastRoulette_${message.author.id}_${message.guild.id}`, Date.now());
    const userlost = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setDescription(`You have lost **${money}** coins!\n**Number:** ${random} | **Color:** ${colour}\n\nYou now have **${score.coins - money}** coins.`)
      .setColor("#e74c3c")

    if (random == 0 && colour === "Green") { // Green
      money = parseInt(money * 5)

      const jackpot = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`You have won **${money}** coins!\n**Number:** ${random} | **Color:** Green\n\nYou now have **${score.coins + money}** coins.`)
        .setColor("#2ae04f")
      if (boost.time.coins !== null && cooldown - (Date.now() - boost.time.coins) > 0) {
        money = parseInt(money * boost.multiplier.coins)
        jackpot.setFooter(`You have won an additional ${parseInt(money - money / boost.multiplier.coins)} coins due to your Coin Booster!`)
        jackpot.setDescription(`You have won **${money / boost.multiplier.coins}** coins!\n**Number:** ${random} | **Color:** Green\n\nYou now have **${score.coins + money}** coins.`)
      }

      score.coins += money
      message.channel.send(jackpot)
      console.log(`${message.author.tag} Won the jackpot`)
    } else if (isOdd(random) && colour === "Red") { // Red

      const userwonr = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`You have won **${money}** coins!\n**Number:** ${random} | **Color:** Red\n\nYou now have **${score.coins + money}** coins.`)
        .setColor("#2ae04f")
      if (boost.time.coins !== null && cooldown - (Date.now() - boost.time.coins) > 0) {
        money = parseInt(money * boost.multiplier.coins)
        userwonr.setFooter(`You have won an additional ${parseInt(money - money / boost.multiplier.coins)} coins due to your Coin Booster!`)
        userwonr.setDescription(`You have won **${money / boost.multiplier.coins}** coins!\n**Number:** ${random} | **Color:** Red\n\nYou now have **${score.coins + money}** coins.`)
      }

      score.coins += money
      message.channel.send(userwonr)
    } else if (!isOdd(random) && colour == "Black") { //black

      const userwonb = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`You have won **${money}** coins!\n**Number:** ${random} | **Color:** Black\n\nYou now have **${score.coins + money}** coins.`)
        .setColor("#2ae04f")
      if (boost.time.coins !== null && cooldown - (Date.now() - boost.time.coins) > 0) {
        money = parseInt(money * boost.multiplier.coins)
        userwonb.setFooter(`You have won an additional ${parseInt(money - money / boost.multiplier.coins)} coins due to your Coin Booster!`)
        userwonb.setDescription(`You have won **${money / boost.multiplier.coins}** coins!\n**Number:** ${random} | **Color:** Black\n\nYou now have **${score.coins + money}** coins.`)
      }

      score.coins += money
      message.channel.send(userwonb)
    } else { // Wrong
      score.coins -= money
      message.channel.send(userlost)
    }
    bot.lastRoulette.set(`${message.author.id}-${message.guild.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      time: Date.now()
    });

    bot.setScore(score);
  };
}

module.exports.help = {
  name: 'roulette',
  aliases: [],
  description: 'Allows you to spend your Coins on a game of Roulette.',
  usage: 'roulette [black/red/green] [amount]',
  category: 'economy'
};
