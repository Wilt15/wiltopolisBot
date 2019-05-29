const Discord = require("discord.js");
const ms = require("parse-ms");
const currencyFormatter = require('currency-formatter');
const errors = require("../../utils/errors.js")
const cooldown = 1209600000;

module.exports.run = async (bot, message, args) => {

  if (args[1]) {
    const member = message.mentions.members.first() || message.guild.members.get(args[1]) || message.member;
    let score = await bot.getScore(member.user.id, message.guild.id);
    let boost = await bot.getBoost(member.user.id, message.guild.id);
    if (!score) {
      score = {
        id: `${message.guild.id}-${member.id}`,
        user: member.id,
        guild: message.guild.id,
        points: 0,
        level: 0,
        coins: 0
      };
    }

    if (!boost) {
      boost = {
        user: message.author.id,
        guild: message.guild.id,
        time: { coins: null, xp: null },
        multiplier: { coins: 1, xp: 1 }
      };
    }
    if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_GUILD")) return errors.noPerms(message, "MANAGE_GUILD");
    if (!member) return errors.cantfindUser(message);
    if (args[2] != parseInt(args[2])) return errors.custom(message, `The number **${args[2]}** is not a valid number!`);

    if (args[0] === "add") {
      if (args[2] <= 0) return errors.custom(message, "You can't add zero or less coins!")
      score.coins += parseInt(args[2]);

      const added = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`:white_check_mark: | Successfully added $${args[1]} to ${member}'s balance.`)
        .setColor("#4286f4")
      message.channel.send(added);
    } else if (args[0] === "set") {
      if (args[2] <= 0) return errors.custom(message, "You can't add zero or less coins!")
      score.coins = parseInt(args[2]);

      const set = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`:white_check_mark: | Successfully set ${member}'s balance to $${args[1]}.`)
        .setColor("#4286f4")
      message.channel.send(set);
    } else if (args[0] === "remove") {
      if (args[2] <= 0) return errors.custom(message, "You can't remove zero or less coins!")
      score.coins -= parseInt(args[2]);

      const removed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`:white_check_mark: | Successfully removed $${args[1]} to ${member}'s balance.`)
        .setColor("#4286f4")
      message.channel.send(removed);
    }
    bot.setScore(score);
  } else {
  const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
  if (!member) return errors.cantfindUser(message);
  let score = await bot.getScore(member.user.id, message.guild.id);
  let boost = await bot.getBoost(member.user.id, message.guild.id);
  if (!score) {
    score = {
      id: `${message.guild.id}-${member.id}`,
      user: member.id,
      guild: message.guild.id,
      points: 0,
      level: 0,
      coins: 0
    };
  }

  if (!boost) {
      boost = {
        user: message.author.id,
        guild: message.guild.id,
        time: { coins: null, xp: null },
        multiplier: { coins: 1, xp: 1 }
      };
  }
  const coinEmbed = new Discord.MessageEmbed()
    .setAuthor(`${member.user.username}'s Balance`, member.user.avatarURL())
    .setColor("#056EF7")
    .addField(`Balance:`, `$${score.coins}.00`)
    .setFooter(message.guild.name, message.guild.iconURL())
    .setTimestamp()

  if (boost.time.coins !== null && cooldown - (Date.now() - boost.time.coins) > 0) {
    const timeObj = ms(cooldown - (Date.now() - boost.time.coins));

    coinEmbed.addField(`Booster:`, boost.multiplier.coins + "x");
    coinEmbed.setFooter(`Expires in: ${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s`);
  }
  message.channel.send(coinEmbed);
}
};

module.exports.help = {
  name: "coins",
  aliases: ["balance", "bal"],
  description: 'View yours or someone else\'s coin balance.',
  usage: '',
  category: 'economy'
};
