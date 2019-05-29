const Discord = require("discord.js");
const fs = require("fs");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args[0])
  let xp = await bot.getScore(member.user.id, message.guild.id)
  if (!xp) {
    xp = {
      id: `${message.guild.id}-${member.user.id}`,
      user: member.user.id,
      guild: message.guild.id,
      points: 0,
      level: 0,
      coins: 0
    }
  };
  let getdiff = Math.floor(5 * (xp.level * xp.level) + 50 * xp.level + 100)
  let diff = Math.floor(5 / 6 * xp.level * (2 * xp.level * xp.level + 27 * xp.level + 91))

  if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_GUILD")) return errors.noPerms(message, "MANAGE_GUILD");
  if (!member) return errors.cantfindUser(message);
  if (args[1] <= 0) return errors.custom(message, "You can't set zero or less xp!")
  if (args[1] != parseInt(args[1])) return errors.custom(message, `The number **${args[1]}** is not a valid number!`);

  xp.points = parseInt(args[1]);


  const succes = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setDescription(`${message.author} has set ${member}'s xp to ${args[1]}`)
    .setColor("#4286f4")
  message.channel.send(succes);
  var x = 0;
    for (var i = 0; parseInt(args[1]) >= Math.floor(5*(i+1)*((i + 1)+7)*(2*(i+1)+13)/6); i++) {
      x++
    }
    xp.level = x;
  bot.setScore(xp);
}

module.exports.help = {
  name: "setxp",
  aliases: [],
  description: 'Set the user\'s xp.',
  usage: '',
  category: 'staff'
}
