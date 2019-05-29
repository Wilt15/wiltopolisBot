const Discord = require("discord.js");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  message.delete();
  const user = message.mentions.users.first();
  if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");

	const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])
	if (!amount) return errors.custom(message, 'Specify an amount of messages to delete or purge!')
	if (!amount && !user) return errors.custom(message, 'Specify a user and amount, or just an amount, of messages to delete or purge!')

  if (user) {
    message.channel.messages.fetch({})
  		.then((messages) => {
  			messages = messages.filter(m => m.author.id === user.id && (new Date().getTime() - m.createdAt) / 86400000 < 14 && m.id !== message.id).array().slice(0, amount);
  			message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  		});
  } else {
  message.channel.messages.fetch({limit: amount})
		.then((messages) => {
      messages = messages.filter(m => (new Date().getTime() - m.createdAt) / 86400000 < 14 && m.id !== message.id)
			message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
		});
  }

    const purgeEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${message.author.id}`)
    .setDescription(`Cleared ${parseInt(args[0])} messages in ${message.channel}\n\n `)
    .setTimestamp()

  const guildConf = await bot.getSettings(message.guild.id);
  const incidentchannel = message.guild.channels.find(c => c.name === guildConf.modLogChannel) || message.guild.channels.get(guildConf.modLogChannel) || message.guild.channels.get(guildConf.modLogChannel.slice(2, -1));
  if (!incidentchannel) {
    message.channel.send("Can't find incidents channel.");
  } else {
    incidentchannel.send(purgeEmbed);
  }
}

module.exports.help = {
  name: "purge",
  aliases: ["prune"],
  description: 'Deletes a x amount of messages.',
  usage: '<user> [amount]',
  category: 'staff'
}
