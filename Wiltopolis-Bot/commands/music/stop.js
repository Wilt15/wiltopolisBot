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
		if (!voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
}

module.exports.help = {
  name: "stop",
  aliases: [],
  description: 'Stops the bot from playing a song.',
  usage: '',
  category: 'music'
}
