const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  if (message.channel.parent.id === "579374804289716224") {
    if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    const member = message.guild.members.get(message.channel.name.slice(8));
    if (member) {
      message.channel.delete()

      const embed = new Discord.MessageEmbed()
        .setAuthor("Thread Closed", "https://cdn.discordapp.com/attachments/539574371853926420/579090689132855308/JPEG_20190518_011420.jpg")
        .setDescription(`Your thread has been closed by ${message.author}.`)
        .setFooter('If you wish to reopen this, or create a new one, please send a message to the bot.')
        .setColor("RED");

      if (args[0] !== "silently") member.user.send(embed);
    }
  } else {
    return errors.custom(message, "This is not a thread channel.")
  }
}

module.exports.help = {
  name: "close",
  aliases: [],
  description: 'Close the current thread.',
  usage: '<silently>',
  category: 'staff'
}
