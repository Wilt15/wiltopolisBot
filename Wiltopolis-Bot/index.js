const Discord = require('discord.js');
const bot = new Discord.Client({ autoReconnect:true });

const talkedRecently = new Set();
const config = require('./config.json');
const jlmessages = require('./join-leave.js');
const antispam = require('./antispam.js');
const fs = require('fs');
const time = require('parse-ms');
const dateFormat = require('dateformat');

bot.queue = new Map();
bot.owner = config.ownerID;

bot.commands = new Discord.Collection();
bot.giveawaymap = new Discord.Collection();
bot.warns = new Discord.Collection();
bot.lastRoulette = new Discord.Collection();
bot.lastGamble = new Discord.Collection();
bot.lastCoinflip = new Discord.Collection();

const MongoClient = require('mongodb').MongoClient;
const mongoclient = new MongoClient(process.env.MONGODB_URI,
	{
		connectTimeoutMS: 30000,
		keepAlive: 1,
		ssl: true,
		sslValidate: false,
		useNewUrlParser: true,
	});


const invites = {};

const loadCommands = module.exports.loadCommands = (dir = './commands/') => {
	fs.readdir(dir, (error, files) => {
		if (error) return console.log(error);

		files.forEach((file) => {
			if (fs.lstatSync(dir + file).isDirectory()) {
				loadCommands(dir + file + '/');
				return;
			}

			delete require.cache[require.resolve(`${dir}${file}`)];

			const props = require(`${dir}${file}`);
			console.log(file + ' loaded!');
			bot.commands.set(props.help.name, props);
		});
	});
};
loadCommands();

bot.on('ready', async () => {

	console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);

	bot.user.setActivity(`w!help -  ${bot.guilds.get('515339083946393601').members.size} users`, {
		type: 'STREAMING',
	});

	let i = 0;
	let presences = [`w!help - ${bot.guilds.get('515339083946393601').members.size} users`, 'w!help - DM for help!', 'w!help - https://discord.gg/CFdS3By'];

	setInterval(async function() {
		bot.user.setActivity(presences[i], {
			type: 'STREAMING',
		});
		i++;
		if (i>2) i = 0;
		presences = [`w!help - ${bot.guilds.get('515339083946393601').members.size} users`, 'w!help - DM for help!', 'w!help - https://discord.gg/CFdS3By'];
	}, 60000);

	bot.guilds.forEach(g => {
		g.fetchInvites().then(guildInvites => {
			invites[g.id] = guildInvites;
		});
	});

	try {
		// scores
		await mongoclient.connect();
		const scoredb = mongoclient.db('scores');
		const scheduledb = mongoclient.db('schedule');
		const infodb = mongoclient.db('info');

		const settings = infodb.collection('settings');

		bot.getSettings = function(guild) {
			return settings.findOne({ guild: guild });
		};

		bot.setSettings = function(guild, object) {
			return settings.updateOne(
				{ guild: guild },
				{ $set: object },
				{ upsert: true }
			);
		};

		const scores = scoredb.collection('scores');

		bot.getScore = function(user, guild) {
			return scores.findOne({ user: user, guild: guild });
		};

		bot.setScore = function(object) {
			return scores.updateOne(
				{ user: object.user, guild: object.guild },
				{ $set: object },
				{ upsert: true }
			);
		};
		// scheduledActions
		const scheduledActions = scheduledb.collection('scheduledActions');
		bot.getAction = function(user, guild) {
			return scheduledActions.findOne({ user: user, guild: guild });
		};
		bot.allAction = await scheduledActions.find({}).toArray();
		bot.deleteAction = function(user, guild) {
			return scheduledActions.deleteOne({ user: user, guild: guild });
		};
		bot.setAction = function(object) {
			return scheduledActions.updateOne(
				{ user: object.user, guild: object.guild },
				{ $set: object },
				{ upsert: true });
		};
		// giveaway
		const giveaways = infodb.collection('giveaways');
		bot.getInfo = function() {
			return giveaways.find({}).toArray();
		};
		bot.deleteInfo = function(messageid) {
			return giveaways.deleteOne({ messageid: messageid });
		};
		bot.setInfo = function(object) {
			return giveaways.updateOne(
				{ messageid: object.messageid },
				{ $set: object },
				{ upsert: true });
		};
		// boosters
		const boosters = scheduledb.collection('boosters');
		bot.getBoost = function(user, guild) {
			return boosters.findOne({ user: user, guild: guild });
		};
		bot.allBoost = await boosters.find({}).toArray();
		bot.deleteBoost = function(user, guild) {
			return boosters.deleteOne({ user: user, guild: guild });
		};
		bot.setBoost = function(object) {
			return boosters.updateOne(
				{ user: object.user, guild: object.guild },
				{ $set: object },
				{ upsert: true });
		};
		// warns
		const warns = infodb.collection('warns');
		bot.getWarn = function(user, guild) {
			return warns.find({ user: user, guild: guild }).toArray();
		};
		bot.allWarn = function(guild) {
			return warns.find({ guild: guild }).toArray();
		};
		bot.deleteWarn = function(id, user, guild) {
			return warns.deleteOne({ id: id, user: user, guild: guild });
		};
		bot.setWarn = function(object) {
			return warns.insertOne(object);
		};
	}
	catch (err) {
		console.error(err);
	}
	bot.guilds.forEach(async guild => {
		const guildConf = await bot.getSettings(guild.id);
		if (!guildConf) {
			const defaultSettings = {
				prefix: 'w!',
				modLogChannel: 'action-log',
				modRole: 'Moderator',
				muteRole: 'Muted',
				reportChannel: 'reports',
				adminRole: 'Admin',
				antiSwearEnabled: false,
				autoModEnabled: true,
				autoModInvitesEnabled: true,
				autoModLinksEnabled: false,
				autoModLinksWhitelist: [],
				autoModLinksBlacklist: [],
				autoModAllCapsEnabled: true,
				autoModAllCapsMinCharacters: 20,
				autoModAllCapsPercentageCaps: 70,
				autoModDuplicateTextEnabled: true,
				autoModDuplicateTextNumberOfMessages: 7,
				autoModDuplicateTextTimeframeInSeconds: 30,
				autoModQuickMessagesEnabled: true,
				autoModQuickMessagesNumberOfMessages: 5,
				autoModQuickMessagesTimeframeInSeconds: 4,
			};
			bot.setSettings(guild.id, defaultSettings);
		}
	});

	// mute
	setInterval(async function() {
		if (bot.allAction.length) {
			bot.allAction.forEach(async (member) => {
				if (member.user && member.duration - (Date.now() - member.time) <= 0) {
					const muterole = bot.guilds.get(member.guild).roles.find(r => r.name === 'Muted');

					const guild = bot.guilds.get(member.guild);
					if (guild) {
						guild.members.get(member.user).roles.remove(muterole.id);
						bot.deleteAction(member.user, member.guild);
					}
				}
			});
		}
	}, 60000);

	setInterval(async function() {
		if (bot.allBoost.length) {
			bot.allBoost.forEach(async (boost) => {
				const user = bot.users.get(boost.user);

				if (boost && 1209600000 - (Date.now() - boost.time.xp) <= 0 && boost.time.xp != null) {
					boost.time.xp = null;
					bot.setBoost(boost);

					const embed = new Discord.MessageEmbed()
						.setAuthor(user.username, user.avatarURL())
						.setColor('RED')
						.setDescription('Your XP Booster has expired!');

					user.send(embed);
				}

				if (boost && 1209600000 - (Date.now() - boost.time.coins) <= 0 && boost.time.coins != null) {
					boost.time.coins = null;
					bot.setBoost(boost);

					const embed2 = new Discord.MessageEmbed()
						.setAuthor(user.username, user.avatarURL())
						.setColor('RED')
						.setDescription('Your Coin Booster has expired!');

					user.send(embed2);
				}
			});
		}
	}, 60000);

	setInterval(async function() {
		const info = await bot.getInfo();
		if (info.length) {
			info.forEach(async (giveaway) => {
				const winners = [];

				const suffix = giveaway.winnercount == 1 ? `${giveaway.winnercount} Winner` : `${giveaway.winnercount} Winners`;

				const guild = bot.guilds.get(giveaway.guildid);
				if (guild) {
					const channel = guild.channels.get(giveaway.channelid);
					if (channel) {
						channel.messages.fetch(giveaway.messageid).then(async embedmsg => {
							const users = await embedmsg.reactions.get('🎁').users.fetch();
							const list = users.array().filter(u => u.id !== bot.user.id);
							let timer;

							if (time(giveaway.endtime - Date.now()).weeks > 0) timer = `${time(giveaway.endtime - Date.now()).weeks} weeks`;
							else if (time(giveaway.endtime - Date.now()).days > 0) timer = `${time(giveaway.endtime - Date.now()).days} days, ${time(giveaway.endtime - Date.now()).hours} hours`;
							else if (time(giveaway.endtime - Date.now()).hours > 0) timer = `${time(giveaway.endtime - Date.now()).hours} hours, ${time(giveaway.endtime - Date.now()).minutes} minutes`;
							else if (time(giveaway.endtime - Date.now()).minutes > 0) timer = `${time(giveaway.endtime - Date.now()).minutes} minutes, ${time(giveaway.endtime - Date.now()).seconds} seconds`;
							else if (time(giveaway.endtime - Date.now()).seconds > 0) timer = `${time(giveaway.endtime - Date.now()).seconds} seconds`;

							if (Date.now() >= giveaway.endtime) {
								if (!list.length) {
									const nwEmbed = new Discord.MessageEmbed()
										.setAuthor(giveaway.title, bot.user.avatarURL())
										.setDescription('No one won!\nTime Remaining: Expired')
										.setFooter(`${suffix} | Ended at`)
										.setTimestamp(new Date(giveaway.endtime))
										.setColor('#056EF7');

									embedmsg.edit(nwEmbed);
									bot.deleteInfo(giveaway.messageid);
								}
								else {
									for (let y = 0; y < giveaway.winnercount; y++) {
										const x = users.filter(u => u.id !== bot.user.id).random();

										if (!winners.includes(x)) winners.push(x);
									}
									const winEmbed = new Discord.MessageEmbed()
										.setAuthor(giveaway.title, bot.user.avatarURL())
										.setDescription(`Winner: ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', ')}\nTime Remaining: Expired`)
										.setFooter(`${suffix} | Ended at`)
										.setTimestamp(new Date(giveaway.endtime))
										.setColor('#056EF7');

									embedmsg.edit(winEmbed);
									if (winners.length) channel.send(`:gift: Congratulations, ${winners.map(u => u.toString()).join(', ')}! You won the giveaway for **${giveaway.title}**!`);
									bot.deleteInfo(giveaway.messageid);
								}
							}
							else {

								const editEmbed = new Discord.MessageEmbed()
									.setAuthor(giveaway.title, bot.user.avatarURL())
									.setDescription(`React with :gift: to enter!\nTime Remaining: ${timer}`)
									.setFooter(`${suffix} | Ends at`)
									.setTimestamp(new Date(giveaway.endtime))
									.setColor('#056EF7');

								embedmsg.edit(editEmbed);
							}
						});
					}
				}
			});
		}
	}, 5000);
});

/*bot.on('presenceUpdate', (oldPresence, newPresence) => {
  if (newPresence.activity != null && !newPresence.equals(oldPresence) && newPresence.activity.type === "STREAMING" && newPresence.user.id === "279786331465318401") {
    const guild = bot.guilds.get("515339083946393601");
    if (guild) {
      const channel = guild.channels.get("515375048622735371");
      channel.send(`Hey @everyone, Wilted15 is now live on https://twitch.tv/wilted15, Go check it out!`)
    } 
  }
})*/

bot.on('guildMemberAdd', async member => {
	const muted = await bot.getAction(member.user.id, member.guild.id);
	const guildConf = await bot.getSettings(member.guild.id);

	const mcount = member.guild.channels.get("515370592069746718");
	mcount.setName(`Member Count: ${member.guild.members.size}`)

	const joinleave = member.guild.channels.get('579377957752274954');
	const joinEmbed2 = new Discord.MessageEmbed()
		.setAuthor(member.user.username, member.user.avatarURL())
		.setDescription(jlmessages.list(member)[Math.floor(Math.random() * jlmessages.list(member).length)])
		.setColor('#4bd868');

	if (joinleave) joinleave.send(joinEmbed2);

	member.roles.add("515368488655912991");

	if (muted && muted.duration - (Date.now() - muted.time) > 0) {
		const muterole = member.guild.roles.find(r => r.name === 'Muted');
		member.roles.add(muterole.id);
	}

	member.guild.fetchInvites().then(guildInvites => {
		const ei = invites[member.guild.id];
	  invites[member.guild.id] = guildInvites;
	  const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
	 	const inviter = bot.users.get(invite.inviter.id);

		const log = member.guild.channels.find(c => c.name === guildConf.modLogChannel) || member.guild.channels.get(guildConf.modLogChannel) || member.guild.channels.get(guildConf.modLogChannel.slice(2, -1));
		const join = new Discord.MessageEmbed()
			.setAuthor('Member Joined', member.user.avatarURL())
			.setDescription(`${member.user} **${member.user.tag}** has joined the server using invite code **${invite.code}**, which was made by **${inviter.tag}**.\nThe invite was used **${invite.uses}** times.`)
			.addField('Created At', `${dateFormat(member.user.createdAt.getTime(), "ddd, mmm dd, h:MM TT yyyy")}\n${parseInt((new Date() - member.user.createdAt.getTime()) / 86400000)} days ago`)
			.setThumbnail(member.user.avatarURL())
			.setFooter(`ID: ${member.user.id}`)
			.setTimestamp()
			.setColor('GREEN');

		log.send(join);
	});

	const joinEmbed = new Discord.MessageEmbed()
		.setColor()
		.setDescription(`Hey ${member.user.username}, Welcome to **${member.guild.name}**!`);
	member.send(joinEmbed);


});

bot.on('guildMemberRemove', async member => {
	const guildConf = await bot.getSettings(member.guild.id);

	const mcount = member.guild.channels.get("515370592069746718");
	mcount.setName(`Member Count: ${member.guild.members.size}`)

	const log = member.guild.channels.find(c => c.name === guildConf.modLogChannel) || member.guild.channels.get(guildConf.modLogChannel) || member.guild.channels.get(guildConf.modLogChannel.slice(2, -1));
	const left = new Discord.MessageEmbed()
		.setAuthor('Member Left', member.user.avatarURL())
		.setDescription(`<@${member.user.id}> **${member.user.tag}** has left the server.`)
		.addField('Created At', `${dateFormat(member.user.createdAt.getTime(), "ddd, mmm dd, h:MM TT yyyy")}\n${parseInt((new Date() - member.user.createdAt.getTime()) / 86400000)} days ago`)
		.setThumbnail(member.user.avatarURL())
		.setFooter(`ID: ${member.user.id}`)
		.setTimestamp()
		.setColor('RED');

	log.send(left);

});

bot.on('messageDelete', async (message) => {
	if (message.author.bot) return;
	const guildConf = await bot.getSettings(message.guild.id);
	const log = message.guild.channels.find(c => c.name === guildConf.modLogChannel) || message.guild.channels.get(guildConf.modLogChannel) || message.guild.channels.get(guildConf.modLogChannel.slice(2, -1));
	const deleted = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.avatarURL())
		.setDescription(`Message deleted in ${message.channel}`)
		.addField("Content", message.content)
		.setFooter(`ID: ${message.author.id}`)
		.setTimestamp()
		.setColor('#ff4823');

	log.send(deleted);
});

bot.on('messageUpdate', async (oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.content === newMessage.content) return;
	const guildConf = await bot.getSettings(newMessage.guild.id);
	const log = newMessage.guild.channels.find(c => c.name === guildConf.modLogChannel) || newMessage.guild.channels.get(guildConf.modLogChannel) || newMessage.guild.channels.get(guildConf.modLogChannel.slice(2, -1));
	const edit = new Discord.MessageEmbed()
		.setAuthor(newMessage.author.username, newMessage.author.avatarURL())
		.setDescription(`Message edited in ${newMessage.channel}`)
		.addField('Before', oldMessage.content || 'N/A')
		.addField('After', newMessage.content || 'N/A')
		.setFooter(`ID: ${newMessage.author.id}`)
		.setTimestamp()
		.setColor('#056EF7');

	log.send(edit);
});

bot.on('message', async message => {
	if (message.author.bot) return;
	require('./dmmessage.js')(bot, message);
	if (message.channel.type === "dm") return;
	antispam(bot, message);
	bot.guildConf = await bot.getSettings(message.guild.id);

	const prefixes = [`${bot.guildConf.prefix}`, `<@!${bot.user.id}> `, `<@${bot.user.id}>`];

	let prefix = false;
	for (const Prefix of prefixes) {
		if (message.content.startsWith(Prefix)) prefix = Prefix;
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/g).slice(1);


	let score = await bot.getScore(message.author.id, message.guild.id);
	let boost = await bot.getBoost(message.author.id, message.guild.id);
	if (!score) {
		score = {
			id: `${message.guild.id}-${message.author.id}`,
			user: message.author.id,
			guild: message.guild.id,
			points: 0,
			level: 0,
			coins: 0,
		};
	}
	if (!boost) {
			boost = {
				user: message.author.id,
				guild: message.guild.id,
				time: { coins: null, xp: null },
				multiplier: { coins: 1, xp: 1 }
			};
	}

	const coinAmt = Math.random();
	const coins = (boost && 1209600000 - (Date.now() - boost.time.coins) > 0)?((Math.random() * 10) + 1)*1.5:((Math.random() * 10) + 1);

	if (coinAmt <= 0.008) {
		const coinEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL())
			.setColor('#53f442')
			.setDescription(`💰 +${parseInt(coins)} Coins!`);

		score.coins += parseInt(coins);
		message.channel.send(coinEmbed).then(msg => {
			msg.delete({
				timeout: 5000,
			});
		});
	}
	let points = Math.floor(Math.random() * 10) + 10;
	if (boost && 1209600000 - (Date.now() - boost.time.xp) > 0) {
		points = parseInt(points * boost.multiplier.xp);
	}
	if (!talkedRecently.has(message.author.id)) {
		score.points += points;

		talkedRecently.add(message.author.id);
		setTimeout(() => {
			talkedRecently.delete(message.author.id);
		}, 60000);
	}
	const curLevel = Math.floor(5 / 6 * (score.level + 1) * (2 * (score.level + 1) * (score.level + 1) + 27 * (score.level + 1) + 91));
	if (score.points >= curLevel) {
		score.level++;
		const coinReward = score.level.toString().slice(-1) == 0 ? 100 : score.level.toString().slice(-1) == 5 ? 50 : 20;
		const vip = message.guild.roles.get("513480322546008073");
		const vipplus = message.guild.roles.get("513480806665158688");

		const lvlup = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL())
			.setColor('#056EF7')
			.setDescription(`Congratulations, you have reached level **${score.level}**!`)
			.addField('Rewards:', `• ${coinReward} Coins\n` + (score.level == 15 ? "• VIP Role" : score.level == 30 ? "• VIP[+] Role" : ""));
 		if (score.level >= 15) message.member.roles.add(vip);
		if (score.level >= 30) message.member.roles.add(vipplus);
    score.coins += coinReward;
		message.channel.send(lvlup).then(m => m.delete({timeout: 10000}));
	}
	bot.setScore(score);
	if (!prefix) return;

	const cmd = message.content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();
	const commandfile = bot.commands.get(cmd) || bot.commands.find(c => c.help.aliases && c.help.aliases.includes(cmd));
	if (commandfile) commandfile.run(bot, message, args);
});

bot.login(process.env.TOKEN);
