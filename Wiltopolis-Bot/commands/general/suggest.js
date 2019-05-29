const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  const titleEmbed = new Discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.avatarURL())
  .setDescription(`${message.author}, What is the title of your suggestion?`)
  .setFooter(`Respond with cancel to cancel the command`)
  .setTimestamp()
  .setColor("GREEN")

  message.channel.send(titleEmbed).then(() => {
    message.channel.awaitMessages(m => m.author.id === message.author.id, { max:1, time:60000, errors:['time'] }).then(res => {
      if (res.first().content === "cancel") return;

      const descEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setDescription(`${message.author}, Please provide a description of your suggestion.`)
      .setFooter(`Respond with cancel to cancel the command`)
      .setTimestamp()
      .setColor("GREEN")

      message.channel.send(descEmbed).then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, { max:1, time:60000, errors:['time'] }).then(desc => {
          if (desc.first().content === "cancel") return;

          const finalEmbed = new Discord.MessageEmbed()
          .setAuthor("Server Suggestion", "https://cdn.discordapp.com/attachments/539574371853926420/579082518075146240/3ba3b5bf806373f76826d1ad40d09810.png")
          .addField("Title", res.first().content)
          .addField("Description", desc.first().content)
          .setFooter(`Posted by ${message.author.tag}`, message.author.avatarURL())
          .setTimestamp()

          const channel = message.guild.channels.find(x => x.name === "suggestions");

          const check = message.guild.emojis.find(x => x.name === "check");
          const cross = message.guild.emojis.find(x => x.name === "cross");
          if (channel) channel.send(finalEmbed).then(m => m.react(check).then(() => m.react(cross)))

          const thankEmbed = new Discord.MessageEmbed()
          .setAuthor("Suggestion Created", "https://cdn.discordapp.com/attachments/539574371853926420/579084479029706773/JPEG_20190518_011401.jpg")
          .setDescription(`${message.author}, Thank you for your suggestion! You can check it out in ${channel}.`)
          .setFooter(message.guild.name)
          .setTimestamp()
          .setColor("GREEN");

          message.channel.send(thankEmbed)
        })
      })
    })
  })
}

module.exports.help = {
  name: "suggest",
  aliases: [],
  description: 'Creates a suggestion.',
  usage: '',
  category: 'general'
}
