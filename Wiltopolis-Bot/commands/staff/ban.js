const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  message.delete();
  if (message.author.id !== bot.owner && !message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS");
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let bReason = args.join(" ") || "No reason supplied."
  if (!bUser) return errors.cantfindUser(message);
  if (bUser.id === bot.user.id) return errors.botuser(message);
  if (!bReason) return errors.noReason(message);
  if (bUser.user.id === bot.owner || bUser.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, bUser, "MANAGE_MESSAGES");

  let banEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Banned", bUser.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${bUser.id}`)
    .setDescription(`**Banned User**: ${bUser}\n**Banned By**: ${message.author}\n**Reason**: ${bReason}`)
    .setTimestamp()

  let dmEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Banned", bUser.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${bUser.id}`)
    .setDescription(`**Banned By**: ${message.author}\n**Reason**: ${bReason}`)
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
}

module.exports.help = {
  name: "ban",
  aliases: [],
  description: 'Ban a user.',
  usage: '[user] [reason]',
  category: 'staff'
}
