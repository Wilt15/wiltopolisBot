const Discord = require("discord.js");
const errors = require("../../utils/errors.js");
const ms = require('ms');
const time = require('parse-ms');


module.exports.run = async (bot, message, args) => {
  if (args[0] === "create" || args[0] === "start") {
    const channel = message.mentions.channels.first() || message.guild.channels.find(c => c.name === args[1]) || message.guild.channels.get(args[1]);
    const suffix = args[2]==1?`${args[2]} Winner`:`${args[2]} Winners`;
    let winners = [];

    let timer = ``;
    if (time(ms(args[3])).weeks > 0) timer = `${time(ms(args[3])).weeks} weeks`;
    else if (time(ms(args[3])).days > 0) timer = `${time(ms(args[3])).days} days, ${time(ms(args[3])).hours} hours`;
    else if (time(ms(args[3])).hours > 0) timer = `${time(ms(args[3])).hours} hours, ${time(ms(args[3])).minutes} minutes`;
    else if (time(ms(args[3])).minutes > 0) timer = `${time(ms(args[3])).minutes} minutes, ${time(ms(args[3])).seconds} seconds`;
    else if (time(ms(args[3])).seconds > 0) timer = `${time(ms(args[3])).seconds} seconds`;

    if (message.author.id !== bot.owner && !message.member.hasPermission("MESSAGE_SERVER")) return errors.noPerms(message, "MESSAGE_SERVER");
    if (ms(args[3]) > ms("2w") || ms(args[3]) < 10000) return errors.custom(message, "Giveaway Time can't be shorter than 10 seconds and longer than 14 days!");

    const startEmbed = new Discord.MessageEmbed()
      .setAuthor(args.slice(4).join(" "), bot.user.avatarURL())
      .setDescription(`React with :gift: to enter!\nTime Remaining: ${timer}`)
      .setFooter(`${args[2]==1?`${args[2]} Winner`:`${args[2]} Winners`} | Ends at`)
      .setTimestamp(new Date(Date.now() + ms(args[3])))
      .setColor("#056EF7");

    channel.send(startEmbed).then(embedmsg => {
      embedmsg.react("🎁");
      const object = {
        messageid: embedmsg.id,
        channelid: channel.id,
        guildid: message.guild.id,
        length: ms(args[3]),
        endtime: Date.now() + ms(args[3]),
        title: args.slice(4).join(" "),
        winnercount: args[2]
      };
      bot.setInfo(object);
    });
  }
  if (args[0] === "reroll") {
    message.channel.send(`🎁 The new winner is ${message.guild.members.random()}! Congratulations!`);
  }
  if (args[0] === "end") {
    const getInfo = await bot.getInfo()
    const info = getInfo.filter(x => x.guildid === message.guild.id)[0]
    let winners = [];

    const channel = message.guild.channels.get(info.channelid);
    if (channel) {
      channel.messages.fetch(args[1] || info.messageid).then(async m => {
        const users = await m.reactions.get("🎁").users.fetch();
        const list = users.array().filter(u => u.id !== bot.user.id);
        const suffix = info.winnercount==1?`1 Winner`:`${info.winnercount} Winners`;
        const x = users.filter(u => u.id !== bot.user.id).random();
        for (let i = 0; i < info.winnercount; i++) {
          if (!winners.includes(x)) winners.push(x);
        }
        const embed = new Discord.MessageEmbed()
          .setAuthor(info.title, bot.user.avatarURL())
          .setDescription(`Winner: ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(" ")}\nTime Remaining: Ended`)
          .setFooter(`${suffix} | Ends at`)
          .setTimestamp(new Date(info.endtime))
          .setColor(`#056EF7`);

        if (!list.length) {
          embed.setDescription(`No one won!\nTime Remaining: Ended`);
          embed.setColor(`#056EF7`);
          m.edit(embed);
          bot.deleteInfo(info.messageid);
        } else {
          m.edit(embed);
          m.channel.send(`:gift: Congratulations, ${winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${info.title}**!`);
          bot.deleteInfo(info.messageid);
        }
      });
    }
  }
};
module.exports.help = {
  name: "giveaway",
  aliases: ["g"],
  description: 'GIVEAWAY?!',
  usage: `start/create [channel/id/name] [winnercount] [d,h,m,s] [title]
  w!giveaway reroll
  w!giveaway end <messageid>`,
  category: 'staff'
};
