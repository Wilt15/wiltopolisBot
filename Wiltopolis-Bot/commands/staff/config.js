const Discord = require("discord.js");
const fs = require("fs");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  if (message.author.id !== bot.owner &&  !message.member.hasPermission("MANAGE_SERVER")) return errors.noPerms(message, "MANAGE_SERVER");
  const guildConf = await bot.getSettings(message.guild.id)
  if (!args[0]) {
    const configProps = `\`${Object.keys(guildConf).join("` `")}\``;

    const embed = new Discord.MessageEmbed()
    .setAuthor("Guild Config", bot.user.avatarURL())
    .setDescription(configProps)
    .setColor("#00AE86");

    message.channel.send(embed);
    return;
  }
  if (!args[1]) {
    const [prop, ...value] = args;

    if(!guildConf[prop]) {
      return message.reply("This key is not in the configuration.");
    }

    message.channel.send(`**${prop}**: ${guildConf[prop]}`);

    return;
  }

    const [prop, ...value] = args;

    if(!guildConf[prop]) {
      return message.reply("This key is not in the configuration.");
    }

    if (args[1] === "true") args[1] = true;
    if (args[1] === "false") args[1] = false;

    var object = {
      prefix: "w!",
      modLogChannel: "action-log",
      modRole: "Moderator",
      muteRole: "Muted",
      reportChannel: "reports",
      adminRole: "Admin",
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
      autoModQuickMessagesTimeframeInSeconds: 4
    };
    object[prop] = value.join(" ");
    bot.setSettings(message.guild.id, object);

    message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);

};

module.exports.help = {
  name: "config",
  aliases: [],
  description: 'Show and change the config of the server.',
  usage: '[key] [value]',
  category: 'staff'
};
