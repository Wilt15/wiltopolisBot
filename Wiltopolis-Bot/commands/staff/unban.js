const errors = require("../../utils/errors.js");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  message.delete();
  if (message.author.id !== bot.owner && !message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS");
  message.guild.fetchBans().then(b => {
    try {
      console.log(args.join(" "))
      message.guild.members.unban(b.find(c => c.user.username === args.join(" ")).user.id || b.get(args[0]))
    } catch (e) {
      console.log(e);
      errors.cantfindUser(message);
      return;
    }
    let banned = b.find(c => c.user.username == args.join(" "))
    let banEmbed = new Discord.MessageEmbed()
      .setAuthor("Member Unbanned", banned.user.avatarURL())
      .setColor("#ff4823")
      .setDescription(`**Unbanned User**: ${banned.user}\n**Unbanned By**: ${message.author}`)
      .setFooter(`ID: ${banned.user.id}`)
      .setTimestamp()

    message.channel.send(banEmbed)
    let incidentchannel = message.guild.channels.find(c => c.name === bot.guildConf.modLogChannel);
    if (!incidentchannel) return message.channel.send("Can't find incidents channel.");

    incidentchannel.send(banEmbed);
  })
}

module.exports.help = {
  name: "unban",
  aliases: [],
  description: 'Unban a user.',
  usage: '[user]',
  category: 'staff'
}
