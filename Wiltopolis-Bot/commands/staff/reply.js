const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  if (message.channel.parent.id === "579374804289716224") {
    if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    const member = message.guild.members.get(message.channel.name.slice(8))
    if (member) {
      const embed = new Discord.MessageEmbed()
       .setAuthor(message.author.tag, message.author.avatarURL())
       .setDescription(args.join(" "))
       .setFooter(message.guild.name)
       .setTimestamp()
       .setColor("GREEN");

      member.user.send(embed)
    }
  } else {
    return errors.custom(message, "This is not a thread channel.")
  }
}

module.exports.help = {
  name: "reply",
  aliases: ["r"],
  description: 'Replies to users using this command.',
  usage: '[content]',
  category: 'staff'
}
