const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
const botping = new Date() - message.createdTimestamp;
const msg = new Date();
const msgping = new Date() - msg;

const embed1 = new Discord.MessageEmbed()
.setDescription("Loading...")

message.channel.send(embed1).then(m => {
const embed = new Discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.avatarURL())
  .addField("Latency", Math.round(((Date.now() - msg) + botping) / 2) + "ms", true)
  .addField("API", Math.round(bot.ws.ping) + "ms", true)
  .setTimestamp()
  .setColor("#056EF7")

  m.edit(embed)
})

}
module.exports.help = {
  name: "ping",
  aliases: [],
  description: 'Displays the latency of the bot.',
  usage: '',
  category: 'general'
}
