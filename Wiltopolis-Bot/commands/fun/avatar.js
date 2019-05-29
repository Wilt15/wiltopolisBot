const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args.join(" ")) || message.guild.members.get(args[0]) || message.member

  const embed = new Discord.MessageEmbed()
    .setAuthor(member.user.username, member.user.avatarURL())
    .setImage(member.user.avatarURL({type:"png", size:1024}));

  message.channel.send(embed)
}

module.exports.help = {
  name: "avatar",
  aliases: [],
  description: 'View yours or someone else\'s avatar.',
  usage: '<user>',
  category: 'fun'
}
