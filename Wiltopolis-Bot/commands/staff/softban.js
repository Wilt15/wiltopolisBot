const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  message.delete();
  if (message.author.id !== bot.owner && !message.member.hasPermission("KICK_MEMBERS")) return errors.noPerms(message, "KICK_MEMBERS");
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let bReason = args.join(" ")
  if (!bUser) return errors.cantfindUser(message);
  if (bUser.id === bot.user.id) return errors.botuser(message);
  if (!bReason) return errors.noReason(message);
  if (bUser.user.id === bot.owner || bUser.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, bUser, "MANAGE_MESSAGES");

  let banEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Kicked", bUser.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${bUser.id}`)
    .setDescription(`**Kicked User**: ${bUser}\n**Kicked By**: ${message.author}\n**Reason**: ${bReason}`)
    .setTimestamp()

  let dmEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Kicked", bot.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${bUser.id}`)
    .setDescription(`**Kicked By**: ${message.author}\n**Reason**: ${bReason}`)
    .setTimestamp()

  message.channel.send(banEmbed)

  let incidentchannel = message.guild.channels.find(c => c.name === bot.guildConf.modLogChannel);
  if (!incidentchannel) {
    message.channel.send("Can't find incidents channel.");
  } else {
    incidentchannel.send(banEmbed);
  }

  bUser.user.send(dmEmbed)
  message.guild.member(bUser).ban({days:7, reason:bReason});
  message.guild.members.unban(bUser)
}

module.exports.help = {
  name: "softban",
  aliases: [],
  description: 'Softban a user.',
  usage: '[user] [reason]',
  category: 'staff'
}
