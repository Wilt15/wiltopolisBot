const Discord = require("discord.js");
const fs = require("fs");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args[0])
  let pCoins = await bot.getScore(member.id, message.guild.id);
  let sCoins = await bot.getScore(message.author.id, message.guild.id);
  if (!sCoins.coins) {
    return errors.custom(message, "You don't have any coins!")
  }

  if (!pCoins) {
    pCoins = {
      id: `${message.guild.id}-${message.author.id}`,
      user: member.id,
      guild: message.guild.id,
      points: 0,
      level: 0,
      coins: 0
    }
  }
  if (isNaN(args[1])) return errors.custom(message, `The number **${args[1]}** is not a valid number!`);
  if (member.user.id === message.author.id) return errors.custom(message, "You can't give yourself coins.");
  if (sCoins.coins < args[1]) return errors.custom(message, "You don't enough coins!");
  if (sCoins <= 0) return errors.custom(message, "You can not pay zero or less coins to someone!")

  pCoins.coins += parseInt(args[1]);
  sCoins.coins -= parseInt(args[1]);


  const succes = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setDescription(`:white_check_mark: | Successfully transferred $${args[1]} to ${member}'s balance.`)
    .setColor("GREEN")
  message.channel.send(succes);

  bot.setScore(pCoins);
  bot.setScore(sCoins);
}

module.exports.help = {
  name: "pay",
  aliases: [],
  description: 'Allows you to pay another user coins from your balance.',
  usage: '[user] [amount]',
  category: 'economy'
}
