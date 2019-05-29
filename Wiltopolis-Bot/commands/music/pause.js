const { Client, Util } = require('discord.js');
const { PREFIX, GOOGLE_API_KEY } = require('../../config.json');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports.run = async (bot, message, args) => {
	const searchString = args.join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = bot.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;
  message.delete();
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
      		}
		return message.channel.send('There is nothing playing.');
}

module.exports.help = {
  name: "pause",
  aliases: [],
  description: 'Pauses the current song.',
  usage: '',
  category: 'music'
}
