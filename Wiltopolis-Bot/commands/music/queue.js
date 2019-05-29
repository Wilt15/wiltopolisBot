const { Client, Util } = require('discord.js');
const Discord = require('discord.js');
const { PREFIX, GOOGLE_API_KEY } = require('../../config.json');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports.run = async (bot, message, args) => {
	const searchString = args.join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = bot.queue.get(message.guild.id);
  const voiceChannel = message.member.voiceChannel;

  let slice1 = 0 + (10 * (parseInt(args[0]) - 1))
  let slice2 = 10 + (10 * (parseInt(args[0]) - 1))
  if (!args[0]) {
    slice1 = 0
    slice2 = 10
  }
	let index = 0;
	const np = `${serverQueue.songs[0].title} **(${serverQueue.songs[0].duration})**`
  const promises = serverQueue.songs.slice(1).map(x => `**${++index}.** ${x.title} **(${x.duration})**`).slice(slice1, slice2).join(`\n`);

  let pages = Math.ceil((serverQueue.songs.length - 1) / 10);
  let page = 1;

		if (!serverQueue) return message.channel.send('There is nothing playing.');

    if (args[0]) {
      if (parseInt(args[0]) > pages || parseInt(args[0]) < 1) return;
      page = parseInt(args[0])
    }

  let qu = new Discord.MessageEmbed()
  .setAuthor("📄 | Song Queue")
  .setColor("#00A2E8")
	.addField("Current Song", np + "\n\u200B")
  // .setDescription(promises)
  .setFooter(`Page ${page} of ${pages}`)

	if (serverQueue.songs.length > 1) qu.addField("Up Next", promises);

  message.channel.send(qu)
}

module.exports.help = {
  name: "queue",
  aliases: [],
  description: 'Displays the song queue.',
  usage: '',
  category: 'music'
}
