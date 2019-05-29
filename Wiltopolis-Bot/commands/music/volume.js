const Discord = require('discord.js');
const { PREFIX, GOOGLE_API_KEY } = require('../../config.json');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const errors = require('../../utils/errors.js');

const youtube = new YouTube(GOOGLE_API_KEY);

module.exports.run = async (bot, message, args) => {
	const searchString = args.slice(0).join(' ');
	const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = bot.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;
		if (!message.member.voice.channel) return errors.custom(message, 'You are not in a voice channel!');
		if (!serverQueue) return errors.custom(message, 'There is nothing playing.');
		if (!args[0]) return message.channel.send(new Discord.MessageEmbed().setAuthor("Volume", message.author.avatarURL()).setDescription(`The current volume is: **${serverQueue.volume}**`).setColor("#2ae04f"));
		if (args[0] != parseInt(args[0])) return errors.custom(message, `The number **${args[1]}** is not a valid number!`);
		if ((args[0] > 5 || args[0] < 0) && message.author.id !== bot.owner) return errors.custom(message, "Select a number between 0 and 5!")
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(new Discord.MessageEmbed().setAuthor("Volume", message.author.avatarURL()).setDescription(`I set the volume to: **${args[0]}**`).setColor("#2ae04f"));

}

module.exports.help = {
  name: "volume",
  aliases: [],
  description: 'Changes the bot volume.',
  usage: '<1-5>',
  category: 'music'
}
