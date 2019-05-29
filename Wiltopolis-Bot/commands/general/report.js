const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  message.delete();
  const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args.join(" ")) || message.guild.members.get(args[0]) || message.member
  if (!member) return errors.cantfindUser(message);
  const reason = args.slice(1).join(' ');
  if (!reason) return errors.noReason(message);

  const reportEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Reported", member.user.avatarURL())
    .setColor("#056EF7")
    .setFooter(`ID: ${member.user.id}`)
    .addField("Offender", member.user)
    .addField("Reporter", message.author)
    .addField("Reason", reason)
    .setTimestamp()

  const success = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setDescription(`The report has been successfully submitted`)
    .setColor('GREEN')

  message.channel.send(success).then(m => m.delete({timeout: 10000}))

  const reportschannel = message.guild.channels.find(c => c.name === bot.guildConf.reportChannel)
  if (!reportschannel) return errors.custom(message, "Couldn't find reports channel.");


  message.delete().catch(() => {});
  reportschannel.send(reportEmbed);
}

module.exports.help = {
  name: "report",
  aliases: [],
  description: 'Allows you to report other users for breaking rules or being toxic.',
  usage: '[user] [reason]',
  category: 'general'
}
