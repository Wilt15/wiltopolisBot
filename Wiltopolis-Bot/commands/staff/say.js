const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  message.delete();
  if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  const botmessage = args.slice(0).join(" ");
  message.channel.send(botmessage);
}

module.exports.help = {
  name: "say",
  aliases: [],
  description: 'Allows you to let the bot say something.',
  usage: '[message]',
  category: 'staff'
}
