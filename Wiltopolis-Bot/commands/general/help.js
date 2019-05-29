const Discord = require("discord.js");
const errors = require("../../utils/errors.js");
const config = require("../../config.json");

module.exports.run = async (bot, message, args) => {

  function getCommands(category) {
    return bot.commands.filter(cmd => cmd.help.category === category).map(c => c.help.name)
  }
  function Uc(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  if (!args[0]) {
    const help = new Discord.MessageEmbed()
      .setAuthor(`Help Menu`, bot.user.avatarURL())
      .setDescription(`The prefix of the bot is currently \`${bot.guildConf.prefix}\`\nUse \`${bot.guildConf.prefix}help [command]\` to get more info on a command.`)
      .setColor(`#056EF7`)
      .addField(`General - ${getCommands("general").length}`, "`" + getCommands("general").join("`  `") + "`")
      .addField(`Music - ${getCommands("music").length}`, "`" + getCommands("music").join("`  `") + "`")
      .addField(`Economy - ${getCommands("economy").length}`, "`" + getCommands("economy").join("`  `") + "`")
      .addField(`Fun - ${getCommands("fun").length}`, "`" + getCommands("fun").join("`  `") + "`")

    if (message.member.hasPermission("MANAGE_MESSAGES")) {
      help.addField(`Staff - ${getCommands("staff").length}`, "`" + getCommands("staff").join("`  `") + "`")
    }

    message.channel.send(help)
  }

  if (!args[0]) return;
  const prefix = bot.guildConf.prefix
  const commandName = args[0]
  const command2 = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
  const name = args[0].toLowerCase();
  const data = [];
  const { commands } = message.client;

if (!command2) {
    return message.reply('that\'s not a valid command!');
}

if (command2.help.description) data.push(`**Description:** ${command2.help.description}`);
if (command2.help.usage) data.push(`**Usage:** ${prefix}${command2.help.name} ${command2.help.usage}`);
if (command2.help.aliases.length >= 1) data.push(`**Aliases:** ${command2.help.aliases.join(', ')}`);

const sEmbed = new Discord.MessageEmbed()
.setAuthor(`${Uc(command2.help.name)} Command`, message.author.avatarURL())
.setDescription(data)
.setFooter("If a command has <> in it, that means that it is an optional argument")
.setColor("#056EF7")

message.channel.send(sEmbed);
}

module.exports.help = {
  name: "help",
  aliases: ["commands", "cmds"],
  description: 'Displays the help menu.',
  usage: '<command>',
  category: 'general'
}
