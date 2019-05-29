const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const db = require("quick.db");
const errors = require("../../utils/errors.js");
const date = require('dateformat')

module.exports.run = async (bot, message, args) => {

  message.delete();
  if (args[0] && message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  if (args[0] === "remove") {
    const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args[1]) || message.guild.members.get(args[1])
    if (!member) return errors.cantfindUser(message);
    var warnarr = await bot.getWarn(member.user.id, message.guild.id)
    if (args[2] != parseInt(args[2])) return errors.custom(message, `The number **${args[2]}** is not a valid number!`);
    if (args[2] <= 0) return errors.custom(message, "You can't add zero or less coins!")

    if (!warnarr.map(x => x.id).includes(parseInt(args[2]))) return errors.custom(message, "That is not a valid warning!")

    const removed = new Discord.MessageEmbed()
    .setAuthor("Warn Removed", member.user.avatarURL())
    .setDescription(`**User**: ${member.user}\n**Removed By**: ${message.author}\n**Removed**: Warning [${args[2]}]`)
    .setFooter(`ID: ${member.user.id}`)
    .setTimestamp()
    .setColor("#ff4823")

    let channel = message.guild.channels.find(c => c.name === bot.guildConf.modLogChannel)
    if (!channel) {
      errors.custom(message, "Can't find incidents channel!")
      message.channel.send(removed)
    } else {
      channel.send(removed)
      message.channel.send(removed)
    }
    bot.deleteWarn(parseInt(args[2]), message.author.id, message.guild.id)
  } else {

    const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args[0]) || message.guild.members.get(args[0]) || message.member
    if (!member) return errors.cantfindUser(message);

    let slice1 = 0 + (3 * (parseInt(args[1]) - 1));
    let slice2 = 3 + (3 * (parseInt(args[1]) - 1));
    if (!args[1]) {
      slice1 = 0;
      slice2 = 3;
    }

    var warnarr = await bot.getWarn(member.user.id, message.guild.id)
    const promises = warnarr.slice(slice1, slice2)
    const pages = Math.ceil((warnarr.length / 3));
    const page = 1;

  if (!warnarr.length) return errors.custom(message, `${member.user.username} has no warnings!`)

  let warnEmbed = new Discord.MessageEmbed()
    .setAuthor(member.user.username, member.user.avatarURL())
    .setDescription(`${member.user} has ${warnarr.length} warnings!\n\u200B`)
    .setColor("#ff4d4d")
    .setFooter(`Page ${page} of ${pages}`);

  Promise.all(promises).then(x => {

    for (var i = 0; i < promises.length; i++) {
    warnEmbed.addField(`Warning ID [${x[i].id}]`, `**Warned By**: ${bot.users.get(x[i].by)} ${bot.users.get(x[i].by).tag}\n**Date**: ${date(new Date(x[i].time), "ddd, mmm dd, yyyy h:MM TT")}\n**Reason**: ${x[i].reason}`)
  }
  message.channel.send(warnEmbed)
  })
}
}

module.exports.help = {
  name: "warns",
  aliases: [],
  description: 'Tells you how many times someone got warned.',
  usage: '[user]',
  category: 'staff'
}
