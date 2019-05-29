let status = true;
let statusWord = 'on';
// Module Name
const name = 'Anti Swear';
// Module identifier
const id = 'antiswear';
// Module Description
const desc = 'Prevents users from swearing or using words we don\'t like.';

// Toggle this module

exports.status = function() {
	return statusWord;
};

exports.toggle = function() {
	if (status) {
		console.log('Module toggled off');
		status = false;
		statusWord = 'off';
	}
	else {
		console.log('Module toggled on');
		status = true;
		statusWord = 'on';
	}
};

// Initialize our module
exports.initialize = function() {
	const swears = require('./swears.js');
	const Discord = require('discord.js');
	const client = new Discord.Client();

	if (!status) {
		console.log(name + ' is disabled, we cannot load it!');
	}

	if (status) {
		client.on('ready', () => {
			console.log(name + ' Loaded!');
			console.log(name + ': ' + desc);
		});

		client.on('message', msg => {
			if (msg.guild) {
				if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
					if (status == false) return;
					const string = msg.content;
					const lower = string.toLowerCase();
					const word = lower.split(' ');
					let i = '';
					for (i = 0; i < swears.list.length; i++) {
						if (word.indexOf(swears.list[i]) >= 0) {
							console.log(i);
							msg.delete();
							break;
						}
					}
				}
			}
		});
	}

	client.login(process.env.TOKEN);
};

// Globals
exports.toggle.status = status;
exports.name = name;
exports.description = desc;
exports.id = id;
