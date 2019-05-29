const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const db = require("quick.db");
const errors = require("../../utils/errors.js");
const help = require("../../utils/help.js");

module.exports.run = async (bot, message, args) => {

  message.delete();
  if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  if (!args[1]) return errors.noReason(message)
  let wUser = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(x => x.user.tag === args[0])
  if (!wUser) return errors.cantfindUser(message);
  let reason = Uc(args.slice(1).join(" ")) 
  var warned = await bot.getWarn(wUser.id, message.guild.id)
  var allWarns = await bot.allWarn(message.guild.id);
    var object = {
      id: allWarns.length + 1,
      user: wUser.id,
      by: message.author.id,
      guild: message.guild.id,
      reason: reason,
      time: Date.now()
    }

  let warnEmbed = new Discord.MessageEmbed()
    .setAuthor(`Member Warned | ID: ${object.id}`, wUser.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${wUser.id} | ${warned.length} warns`)
    .setDescription(`**Warned User**: ${wUser}\n**Warned By**: ${message.author}\n**Reason**: ${reason}`)
    .setTimestamp()

  let warnchannel = message.guild.channels.find(c => c.name === bot.guildConf.modLogChannel);
  if (!warnchannel) {
    message.reply("Couldn't find channel");
  } else {
    warnchannel.send(warnEmbed);
  }

  message.channel.send(warnEmbed)

  let dmEmbed = new Discord.MessageEmbed()
    .setAuthor(`Member Warned | ID: ${object.id}`, wUser.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${wUser.id} | ${warned.length   } warns`)
    .setDescription(`**Warned By**: ${message.author}\n**Reason**: ${reason}`)
    .setTimestamp()

  wUser.send(dmEmbed)

  if (warned.length == 3) {
    let muterole = message.guild.roles.find(x => x.name === "Muted");
    if (!muterole) return errors.custom(message, "Couldn't find the mute role!") 

    let mutetime = "1h";
    await (wUser.roles.add(muterole.id));
    const dbmute = bot.getAction(wUser.id, message.guild.id)
    dbmute = {
      user: wUser.id,
      guild: message.guild.id,
      time: Date.now(),
      action: "mute",
      duration: ms("1h")
    }
    bot.setAction(dbmute)
    help.desc(message, `<@${wUser.id}> has been temporarily muted`);

    setTimeout(function() {
      wUser.roles.remove(muterole.id)
      help.desc(message, `<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if (warned.length == 5) {
    message.guild.member(wUser).ban({time: 7, reason: reason});
    help.desc(message, `<@${wUser.id}> has been banned.`)
    bot.deleteWarn(wUser.id, message.guild.id)
  }
bot.setWarn(object)
  function Uc(string) {

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  }
}

module.exports.help = {
  name: "warn",
  aliases: [],
  description: 'Warn a user.', 
  usage: '[user] [reason]',
  category: 'staff'
}
