const authors = [];
const warned = [];
const banned = [];
const messagelog = [];
const Discord = require('discord.js');

module.exports = async (bot, message) => {
	let warningMessage = 'stop spamming!';
	const guildConf = await bot.getSettings(message.guild.id);
	// Return immediately if user is exempt
	if (message.member.hasPermission('MANAGE_MESSAGES')) return;
	if (guildConf.autoModEnabled == false) return;
	if (message.author.id !== bot.user.id && message.channel.guild) {
		const now = Math.floor(Date.now());
		authors.push({
			'time': now,
			'author': message.author.id,
		});
		messagelog.push({
			'message': message.content,
			'author': message.author.id,
			'time': now,
		});

		// Check how many times the same message has been sent.
		let messageMatch = 0;
		if (guildConf.autoModDuplicateTextEnabled == true) {
			for (var i = 0; i < messagelog.length; i++) {
				if (messagelog[i].time > now - guildConf.autoModDuplicateTextTimeframeInSeconds && messagelog[i].message == message.content && (messagelog[i].author == message.author.id) && (message.author.id !== bot.user.id) && message.author.id === messagelog.author) {
					messageMatch++;
				}
			}
		}
		// Check matched count
		if (messageMatch == guildConf.autoModDuplicateTextNumberOfMessages && !warned.includes(message.author.id)) {
			warn(message, message.author.id);
			message.channel.messages.fetch().then(fetched => message.channel.bulkDelete(fetched.filter(x => x.author.id === message.author.id).array().slice(0, guildConf.autoModDuplicateTextNumberOfMessages)).catch(err => console.error(err)));
		}

		if (guildConf.autoModInvitesEnabled == true) {
			if (message.content.includes('discord.gg/')) {
				warningMessage = 'stop advertising!';
				warn(message, message.author.id);
				message.delete();
			}
		}

		if (guildConf.autoModAllCapsEnabled == true) {
			if (message.content.toLowerCase() !== message.content) {
				if (message.content.match(/[A-Z]/g).length * 100 / message.content.length >= 70 && message.content.length >= 20) {
					message.delete();
					if (message.content.length >= 500) {
						warn(message, message.author.id);
					}
				}
			}
		}
		let matched = 0;
		if (guildConf.autoModQuickMessagesEnabled == true) {
			for (var i = 0; i < authors.length; i++) {
				if (authors[i].time > now - (guildConf.autoModQuickMessagesTimeframeInSeconds * 1000) && authors[i].author === message.author.id) {
					matched++;
					if (matched == guildConf.autoModQuickMessagesNumberOfMessages && !warned.includes(message.author.id)) {
						message.channel.messages.fetch().then(fetched => message.channel.bulkDelete(fetched.filter(x => x.author.id === message.author.id).array().slice(0, guildConf.autoModQuickMessagesNumberOfMessages)).catch(err => console.error(err)));
						warn(message, message.author.id);
					}
				}
				else if (authors[i].time < now - (guildConf.autoModQuickMessagesTimeframeInSeconds * 1000)) {
					authors.splice(i);
					warned.splice(warned.indexOf(authors[i]));
					banned.splice(warned.indexOf(authors[i]));
				}
				if (messagelog.length >= 200) {
					messagelog.shift();
				}
			}
		}
	}

	/**
   * Warn a user
   * @param  {Object} message
   * @param  {string} userid userid
   */
	async function warn(message, userid) {
		const warns = await bot.getWarn(message.author.id, message.guild.id);
		const object = {
			id: warns.length + 1,
			user: message.author.id,
			by: bot.user.id,
			guild: message.guild.id,
			reason: warningMessage,
			time: Date.now(),
		};
		warned.push(message.author.id);

		const warnEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL())
			.setDescription(`<@!${message.author.id}> ` + warningMessage)
			.setColor('#ff4823');
		message.channel.send(warnEmbed);
		bot.setWarn(object);

		setTimeout(function() {
			bot.deleteWarn(object.id, message.author.id, message.guild.id);
		}, 300000);

		if (warns.length >= 5) {
			ban(message, message.author.id);
		}
	}

	async function ban(message, userid) {
		const warns = await bot.getWarn(message.author.id, message.guild.id);
		for (let i = 0; i < messagelog.length; i++) {
			if (messagelog[i].author == message.author.id) {
				messagelog.splice(i);
			}
		}

		banned.push(message.author.id);

		const user = message.guild.members.find(m => m.user.id === message.author.id);
		bot.deleteWarn(user.id, message.guild.id);
		if (user) {
			user.ban({ days:7, reason:'Antispam' }).then((member) => {
				const warnEmbed = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription(`<@!${message.author.id}> has been banned for spamming.`)
					.setColor('#ff4823');
				message.channel.send(warnEmbed);
				return true;
			}).catch(() => {
				message.channel.send(`Insufficient permission to ban ${message.author} for spamming.`);
				return false;
			});
		}
	}
};
