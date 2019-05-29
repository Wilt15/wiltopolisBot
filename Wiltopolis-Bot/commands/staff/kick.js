const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  message.delete()
  if (message.author.id !== bot.owner && !message.member.hasPermission("KICK_MEMBERS")) return errors.noPerms(message, "KICK_MEMBERS");
  let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!kUser) return errors.cantfindUser(message);
  if (kUser.id === bot.user.id) return errors.botuser(message);
  let kReason = args.join(" ") || "No reason supplied."
  if (!kReason) return errors.noReason(message);
  if (kUser.user.id === bot.owner || kUser.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, kUser, "MANAGE_MESSAGES");

  let kickEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Kicked", kUser.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${kUser.id}`)
    .setDescription(`**Kicked User**: ${kUser}\n**Kicked By**: ${message.author}\n**Reason**: ${kReason}`)
    .setTimestamp()

  let dmEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Kicked", kUser.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${kUser.id}`)
    .setDescription(`**Kicked By**: ${message.author}\n**Reason**: ${kReason}`)
    .setTimestamp()

  message.channel.send(kickEmbed)
  let kickChannel = message.guild.channels.find(c => c.name === bot.guildConf.modLogChannel);
  if (!kickChannel) {
    message.channel.send("Can't find incidents channel.");
  } else {
    kickChannel.send(kickEmbed);
  }

  kUser.user.send(dmEmbed)
  message.guild.member(kUser).kick(kReason);
}

module.exports.help = {
  name: "kick",
  aliases: [],
  description: 'Kick a user.',
  usage: '[user] [reason]',
  category: 'staff'
}
