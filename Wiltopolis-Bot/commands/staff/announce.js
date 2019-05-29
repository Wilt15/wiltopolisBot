const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  message.delete();
  if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  let botmessage = args.join(" ");
  const embed = new Discord.MessageEmbed()
    .setAuthor(`Announcement`, bot.user.avatarURL())
    .setDescription((botmessage))
    .setFooter(message.guild.name)
    .setColor(`0x4286f4`)
    .setTimestamp();
  message.channel.send({
    embed
  });
}

module.exports.help = {
  name: "announce",
  aliases: [],
  description: 'Allows you to make an announement.',
  usage: '[message]',
  category: 'staff'
}
