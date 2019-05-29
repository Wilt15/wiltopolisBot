const Discord = require("discord.js");
const ms = require("ms");
let db = require('quick.db')
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  message.delete();
  if (message.author.id !== bot.owner && !message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return errors.cantfindUser(message);
  if (tomute.user.id === bot.owner || tomute.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, tomute, "MANAGE_MESSAGES");
  let reason = args.slice(1).join(" ") || "Not specified."
  if (!reason) return errors.noReason(message);
  let muterole = message.guild.roles.find(r => r.name === "Muted");
  let member = message.mentions.members.first().user.username
  let dbmute = bot.getAction(tomute.user.id, message.guild.id);
  if (!dbmute) {
    dbmute = {
      user: tomute.user.id,
      guild: message.guild.id,
      time: Date.now(),
      duration: ms(args[1])
    }
  }
  //start of create role
  if (!muterole) {
    try {
      muterole = await message.guild.roles.create({
        data: {
        name: "Muted",
        color: "#000000",
        permissions: []
        }
      })
      message.guild.channels.forEach(async (channel, id) => {
        channel.overwritePermissions({
          permissionOverwrites: [{
            id: muterole.id,
            deny:["SEND_MESSAGES", "ADD_REACTIONS"],
          }, ],
          reason: "Mute role required."
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }
  //end of create role

  if (tomute.roles.has(muterole.id)) return errors.custom(message, `${member} is already muted.`);

  let mutetime = args[1];
  if (!mutetime) mutetime = "Not specified.";

  await (tomute.roles.add(muterole.id));

  let muteEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Muted", tomute.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${tomute.id}`)
    .setDescription(`**Muted User**: ${tomute}\n**Muted By**: ${message.author}\n**Duration**: ${mutetime}\n**Reason**: ${reason}`)
    .setTimestamp()

  let dmEmbed = new Discord.MessageEmbed()
    .setAuthor("Member Muted", tomute.user.avatarURL())
    .setColor("#ff4823")
    .setFooter(`ID: ${tomute.id}`)
    .setDescription(`**Muted By**: ${message.author}\n**Duration**: ${mutetime}\n**Reason**: ${reason}`)
    .setTimestamp()

  message.channel.send(muteEmbed)
  let incidentchannel = message.guild.channels.find(c => c.name === bot.guildConf.modLogChannel);
  if (!incidentchannel) {
    message.channel.send("Can't find incidents channel.");
  } else {
    incidentchannel.send(muteEmbed);
  }

  tomute.user.send(dmEmbed)

  bot.setAction(dbmute)

 if (args[1]) {
  setTimeout(function() {
    tomute.roles.remove(muterole.id);
    bot.deleteAction(tomute.user.id, message.guild.id)
    let unmuteEmbed = new Discord.MessageEmbed()
      .setAuthor("Member Unmuted", tomute.user.avatarURL())
      .setColor("#ff4823")
      .setFooter(`ID: ${tomute.id}`)
      .setDescription(`**Unmuted User**: ${tomute}\n**Unmuted By**: ${message.author}`)
      .setTimestamp()

    let incidentchannel = message.guild.channels.find(c => c.name === "action-log");
    if (!incidentchannel) return message.channel.send("Can't find incidents channel.");

    incidentchannel.send(unmuteEmbed);
  }, ms(mutetime));
 }
  //end of module
}

module.exports.help = {
  name: "mute",
  aliases: [],
  description: 'Mute a user.',
  usage: '[user] <time> <reason>',
  category: 'staff'
}
