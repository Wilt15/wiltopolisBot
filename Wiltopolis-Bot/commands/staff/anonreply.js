const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  if (message.channel.parent.id === "579374804289716224") {
    if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    const member = message.guild.members.get(message.channel.name.slice(8))
    if (member) {
     const embed = new Discord.MessageEmbed()
       .setAuthor("Staff Team", "https://cdn.discordapp.com/attachments/539574371853926420/579082518075146240/3ba3b5bf806373f76826d1ad40d09810.png")
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
  name: "anonreply",
  aliases: ["ar"],
  description: 'Replies to users anonymously using this command.',
  usage: '[content]',
  category: 'staff'
}
