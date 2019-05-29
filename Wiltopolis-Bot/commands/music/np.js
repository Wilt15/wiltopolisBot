const { Client, Util } = require('discord.js');
const Discord = require('discord.js');
const { PREFIX, GOOGLE_API_KEY } = require('../../config.json');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports.run = async (bot, msg, args) => {
	const searchString = args.join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = bot.queue.get(msg.guild.id);
  const voiceChannel = msg.member.voice.channel;
  msg.delete();
  const song = serverQueue.songs[0]
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
let start = new Discord.MessageEmbed()
            .setTitle("▶️ | Now Playing")
            .setTimestamp()
            .setColor("#7743f9")
            .setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
            .setDescription(`• **Title:** ${song.title}
• **Channel:** ${song.channelTitle}
• **Length:** ${song.duration}
• **Requested By:** ${song.requestedBy}
• **Link:** ${song.url}`);

msg.channel.send(start)
}

module.exports.help = {
  name: "np",
  aliases: [],
  description: 'Displays the current song.',
  usage: '',
  category: 'music'
}
