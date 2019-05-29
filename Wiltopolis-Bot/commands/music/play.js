const Discord = require('discord.js');
const { PREFIX, GOOGLE_API_KEY } = require('../../config.json');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports.run = async (bot, message) => {
  const args = message.content.split(' ');
	const searchString = args.join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = bot.queue.get(message.guild.id);
  const voiceChannel = message.member.voice;

		if (!voiceChannel.channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = bot.user;
		if (!message.guild.me.hasPermission('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!message.guild.me.hasPermission('SPEAK')) {

			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
        try {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, message, voiceChannel, true);
      } catch(error) {
        console.error(error);
      }
			}
      /*const playlistEmbed = new Discord.MessageEmbed()
      .setTitle("✅ | Added Playlist")
      .setTimestamp()
      .setColor("#2ae04f")
      .setThumbnail(`https://img.youtube.com/vi/${playlist.id}/mqdefault.jpg`)
      .setDescription(`• **Title:** ${playlist.title}
• **Channel:** ${playlist.channelTitle}
• **Requested By:** ${message.author}
• **Link:** ${playlist.url}`);*/
let duration = {
  hours: 0,
  minutes: 0,
  seconds: 0
};

videos.forEach(async video3 => {
  const vid = await youtube.getVideoByID(video3.id);
  duration.hours += vid.duration.hours;
  duration.minutes += vid.duration.minutes;
  duration.seconds += vid.duration.seconds;
  if (duration.seconds >= 60) {
    duration.seconds -= 60;
    duration.minutes++;
  }
  if (duration.minutes >= 60) {
    duration.minutes -= 60;
    duration.hours++;
  }
});

let duration2;
setTimeout(function(){
duration2 = `${(duration.hours>0?(((duration.hours)<10?'0':'') + duration.hours+':'):'') + ((duration.minutes)<10?'0':'') + duration.minutes}:${((duration.seconds)<10?'0':'') + duration.seconds}`;

const playlistEmbed = new Discord.MessageEmbed()
.setAuthor("Added Playlist", bot.user.avatarURL())
.setTitle(playlist.title)
.setURL(playlist.url)
.setTimestamp()
.setColor("#2ae04f")
.setThumbnail(`https://img.youtube.com/vi/${videos[0].id}/mqdefault.jpg`)
.addField("Channel", playlist.channelTitle, true)
.addField("Duration", duration2, true)
.setFooter(`Requested By ${message.author.username}`, message.author.avatarURL());

			return message.channel.send(playlistEmbed);
    },1000);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;

          let results = new Discord.MessageEmbed()
          .setAuthor("Song Selection", bot.user.avatarURL())
          .setColor("#00A2E8")
          .setDescription(videos.map(video2 => `**${++index}.** ${video2.title.replace(/&#39;/g, "'")}`).join('\n'))
          .setFooter("Please provide a value to select one of the search results ranging from 1-10.");
          message.channel.send(results).then(m => m.delete({timeout: 10000}));
// 					message.channel.send(`
// __**Song selection:**__

// ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

// Please provide a value to select one of the search results ranging from 1-10.
// 					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							max: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
    async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = bot.queue.get(message.guild.id);
	const song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`,
    duration: `${(video.duration.hours>0?(((video.duration.hours)<10?'0':'') + video.duration.hours+':'):'') + ((video.duration.minutes)<10?'0':'') + video.duration.minutes}:${((video.duration.seconds)<10?'0':'') + video.duration.seconds}`,
    channelTitle: video.channel.title,
    requestedBy: message.author
	};

	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel.channel,
      requestedBy: message.author,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
      loop: false
		};
		bot.queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.channel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			bot.queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
    /*let add = new Discord.MessageEmbed()
            .setTitle("✅ | Added to Queue")
            .setTimestamp()
            .setColor("#2ae04f")
            .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
            .setDescription(`• **Title:** ${song.title}
• **Channel:** ${song.channelTitle}
• **Length:** ${song.duration}
• **Requested By:** ${message.author}
• **Link:** ${song.url}`);*/
const add = new Discord.MessageEmbed()
.setAuthor("Added to Queue", bot.user.avatarURL())
.setTitle(song.title)
.setURL(song.url)
.setTimestamp()
.setColor("#2ae04f")
.setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
.addField("Channel", song.channelTitle, true)
.addField("Duration", song.duration, true)
.setFooter(`Requested By ${message.author.username}`, message.author.avatarURL());

		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return message.channel.send(add);
	}
	return undefined;
}

async function play(guild, song) {
	const serverQueue = bot.queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		bot.queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.play(await ytdl(song.url, { highWaterMark: 1 << 25}), {type: 'opus'})
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
      if (serverQueue.loop === "queue") {
        serverQueue.songs.push(serverQueue.songs[0]);
      } else if (serverQueue.loop === "song") {
        serverQueue.songs.unshift(serverQueue.songs[0]);
      }
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

/*const start = new Discord.MessageEmbed()
            .setTitle("🎶 | Start Playing")
            .setTimestamp()
            .setColor("#00A2E8")
            .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
            .setDescription(`• **Title:** ${song.title}
• **Channel:** ${song.channelTitle}
• **Duration:** ${song.duration}
• **Requested By:** ${message.author}
• **Link:** ${song.url}`);

message.channel.send(start)*/

const start = new Discord.MessageEmbed()
.setAuthor("Start Playing", bot.user.avatarURL())
.setTitle(song.title)
.setURL(song.url)
.setTimestamp()
.setColor("#00A2E8")
.setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
.addField("Channel", song.channelTitle, true)
.addField("Duration", song.duration, true)
.setFooter(`Requested By ${song.requestedBy.username}`, song.requestedBy.avatarURL());

if (serverQueue.loop !== "song") message.channel.send(start);
}
};

module.exports.help = {
  name:"play",
  aliases: [],
  description: 'Adds a song to the queue.',
  usage: '[song]',
  category: 'music'
};
