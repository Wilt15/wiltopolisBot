const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  message.delete();
  const embed = new Discord.MessageEmbed()
    .setAuthor('Restart', message.author.avatarURL())
    .setDescription(`Restarted in **${Math.floor(bot.ws.ping)}**ms`)
    .setColor("#ff4823")
  if (message.author.id !== bot.owner) return;
  message.channel.send(embed).then(() => {
  process.exit(1);
})
}

module.exports.help = {
  name: "restart",
  aliases: [],
  description: '',
  usage: ''
}
