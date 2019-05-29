const Discord = require('discord.js');
const errors = require('../../utils/errors.js');
const levDist = require('../../utils/levDist.js');

module.exports.run = async (bot, message, args) => {
  const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(x => x.user.tag === args[0]);
  const role = message.mentions.roles.first() || message.guild.roles.get(args[1]) || message.guild.roles.find(x => x.name === args[1]);
  if (!member) return errors.cantfindUser(message);
  if (!message.member.permissions.has('MANAGE_ROLES')) return errors.noPerms(message, 'MANAGE_ROLES')
  if (member.roles.highest.position > message.guild.me.roles.highest.position) return errors.custom(message, 'That user has a higher role!')

  if (!role) {
    let roleDist = [];
    message.guild.roles.forEach(r => {
      const distance = levDist(args[1], r.name);
      roleDist.push({
        distance: distance,
        role: r.name
      });
    });

    const sorted = roleDist.sort((a, b) => a.distance - b.distance);

    if (sorted[0].distance > 0) {
      errors.custom(message, `Could not find that role. Did you mean ${message.guild.roles.find(x => x.name === sorted[0].role).toString()}?`);

      const coll = new Discord.MessageCollector(message.channel, x => x.author.id === message.author.id, {
        max: "1"
      });
      coll.on("collect", m => {
        if (m.content.toLowerCase() === "yes") {
          if (!member.roles.has(message.guild.roles.find(x => x.name === sorted[0].role).id)) return errors.custom(message, 'That user doesn\'t have that role.')
          member.roles.remove(message.guild.roles.find(x => x.name === sorted[0].role));

          const yesSuccess = new Discord.MessageEmbed()
            .setAuthor("Role Removed", member.user.avatarURL())
            .setDescription(`**Removed By**: ${message.author}\n**Member**: ${member.user}\n**Role**: ${message.guild.roles.find(x => x.name === sorted[0].role)}`)
            .setFooter(`ID: ${member.user.id}`)
            .setTimestamp()
            .setColor('#FF4D4D');

          message.channel.send(yesSuccess)
          message.guild.channels.find(c => c.name === "action-log").send(yesSuccess)

        } else if (m.content.toLowerCase() === "no") {
          var i = 0;

          const newList = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .addField("Other Roles", sorted.slice(1).map(x => `**${++i}.** ${message.guild.roles.find(r => r.name === x.role).toString()}`).slice(0, 5).join("\n"))
            .setColor("#ff4d4d")

          m.channel.send(newList);

          const coll2 = new Discord.MessageCollector(m.channel, x => x.author.id === message.author.id, {
            max: "1"
          })
          coll2.on("collect", msg => {
            if (msg.content != parseInt(msg.content) || parseInt(msg.content) < 0 || parseInt(msg.content) > 5) return errors.custom(message, `The number **${msg.content}** is not a valid number!`)
            if (!member.roles.has(message.guild.roles.find(r => r.name === sorted[parseInt(msg.content)].role).id)) return errors.custom(message, 'That user doesn\'t have that role.')
            member.roles.remove(message.guild.roles.find(r => r.name === sorted[parseInt(msg.content)].role))

            const noSuccess = new Discord.MessageEmbed()
              .setAuthor("Role Removed", member.user.avatarURL())
              .setDescription(`**Removed By**: ${message.author}\n**Member**: ${member.user}\n**Role**: ${message.guild.roles.find(r => r.name === sorted[parseInt(msg.content)].role)}`)
              .setFooter(`ID: ${member.user.id}`)
              .setTimestamp()
              .setColor('#FF4D4D');

            message.channel.send(noSuccess)
            message.guild.channels.find(c => c.name === "action-log").send(noSuccess)
          })
        }
      })
    }
  } else {
    if (!member.roles.has(role.id)) return errors.custom(message, 'That user doesn\'t have that role.')
    member.roles.remove(role);

    const success = new Discord.MessageEmbed()
      .setAuthor("Role Removed", member.user.avatarURL())
      .setDescription(`**Removed By**: ${message.author}\n**Member**: ${member.user}\n**Role**: ${role}`)
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp()
      .setColor('#FF4D4D');

    message.channel.send(success)
    message.guild.channels.find(c => c.name === "action-log").send(success)
  }
}

module.exports.help = {
  name: "removerole",
  aliases: [],
  description: 'Remove a role from a user.',
  usage: '[user] [role]'
}
