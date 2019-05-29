const { Client, Util } = require('discord.js');
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {
	const serverQueue = bot.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;

  message.delete();
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		if (args[0] && args[0] != parseInt(args[0])) return errors.custom(message, `The number **${args[1]}** is not a valid number!`);

		if (args[0]) {
		serverQueue.songs.splice(args[0], 1);
		} else {
		serverQueue.connection.dispatcher.end('Skip command has been used!');
	}
}

module.exports.help = {
  name: "skip",
  aliases: [],
  description: 'Skips a song.',
  usage: '<Song Position>',
  category: 'music'
}
