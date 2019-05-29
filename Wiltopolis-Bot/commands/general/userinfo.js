const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("../../config.json");
const ms = require("parse-ms");
const db = require('quick.db')
const dateFormat = require('dateformat')
const currencyFormatter = require('currency-formatter')
const cooldown = 1209600000;

module.exports.run = async (bot, message, args) => {

  const member = message.mentions.members.first() || message.guild.members.find(x => x.user.tag === args.join(" ")) || message.guild.members.get(args[0]) || message.member
  let status = member.user.presence.status;
  const rolelist = member.roles.map(role => role.name).filter(fn).join("`, `")

  function fn(name) {
    return name !== '@everyone'
  }
  if (status === 'online')
    status = 'Online';
  if (status === 'offline')
    status = 'Offline';
  if (status === 'idle')
    status = 'Idle';
  if (status === 'dnd')
    status = 'Do Not Disturb';

  const joindate = dateFormat(member.joinedAt, "ddd, mmm dd, yyyy h:MM TT");
  const registerdate = dateFormat(member.user.createdAt, "ddd, mmm dd, yyyy h:MM TT");
  const infoEmbed = new Discord.MessageEmbed()
    .setAuthor(member.user.tag, member.user.avatarURL())
    .setFooter(`ID: ${member.user.id}`)
    .addField(`Status`, status)
    .addField(`Joined`, joindate)
    .addField(`Registered`, registerdate)
    .addField(`Roles [${member.roles.size-1}]`, '`' + rolelist + '`')
    .setTimestamp()
    .setColor(`#056EF7`)


  message.channel.send(infoEmbed)
}

module.exports.help = {
  name: "userinfo",
  aliases: ["user"],
  description: 'Views yours or someone else\'s information.',
  usage: '<user>',
  category: 'general'
}
