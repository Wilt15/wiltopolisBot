const Discord = require("discord.js");
let dateFormat = require('dateformat')
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  function fn(name) {
    return name !== '@everyone'
  }

  let rolelist = message.guild.roles.map(role => role.name).filter(fn).join(", ")
  let joindate = dateFormat(message.guild.createdAt, "ddd, mmm dd, yyyy h:MM TT");
  let count = message.guild.members.filter(member => !member.user.bot).size;
  let serverembed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setColor("#056EF7")
    .addField("Owner", message.guild.owner)
    .addField("Created At", joindate)
    .addField(`Roles [${message.guild.roles.size-1}]`, rolelist)
    .addField("Total Members", message.guild.memberCount, true)
    .addField("Human", count, true)
    .addField("Bots", message.guild.memberCount - count, true)


  return message.channel.send(serverembed);
}

module.exports.help = {
  name: "serverinfo",
  aliases: [],
  description: 'Displays the server information.',
  usage: '',
  category: 'general'
}
