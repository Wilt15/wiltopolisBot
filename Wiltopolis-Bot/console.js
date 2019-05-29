const stdin = process.openStdin();
const Discord = require('discord.js');
const bot = new Discord.Client({ disableEveryone: true });

stdin.addListener('data', res => {
	const x = res.toString().trim().split(/ +/g);
	try {
		bot.channels.find(c => c.name == x[0]).send(x.slice(1).join(' '));
	}
	catch (e) {
		console.log(`Couldn't find ${x[0]}`);
	}
});

bot.on('message', async message => {
	if (message.author.bot) return;
	try {
		console.log(`[${message.guild.name}] [${message.channel.name}] ` + message.author.username + ' » ' + message.content);
	}
	catch (e) {
		console.log('Can\'t log message');
	}
});

bot.login(process.env.TOKEN);
