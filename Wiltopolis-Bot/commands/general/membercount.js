const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  const count = message.guild.members.filter(member => !member.user.bot).size;
  const mc = new Discord.MessageEmbed()
    .setAuthor(`Membercount`, bot.user.avatarURL())
    .addField("Total Members", message.guild.memberCount, true)
    .addField("Human", count, true)
    .addField("Bots", message.guild.memberCount - count, true)
    .setColor("#056EF7")

  message.channel.send(mc)
}

module.exports.help = {
  name: "membercount",
  aliases: [],
  description: 'Tells you how many users there are in the server.',
  usage: '',
  category: 'general'
}
