const errors = require("../../utils/errors.js");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  message.delete();
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return errors.cantfindUser(message);
  if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  let muterole = message.guild.roles.find(c => c.name === "Muted");
  if (!tomute.roles.has(muterole.id)) return errors.noRoles(message);
  tomute.roles.remove(muterole.id);

  let unmuteEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Unmuted", tomute.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${tomute.id}`)
    .setDescription(`**Unmuted User**: ${tomute}\n**Unmuted By**: ${message.author}`)
    .setTimestamp()

  let incidentchannel = message.guild.channels.find(c => c.name === bot.guildConf.modLogChannel);
  if (!incidentchannel) message.channel.send("Can't find incidents channel.");

  message.channel.send(unmuteEmbed);
  if (incidentchannel) incidentchannel.send(unmuteEmbed);
}

module.exports.help = {
  name: "unmute",
  aliases: [],
  description: 'Unmute a user.',
  usage: '[user]',
  category: 'staff'
}
