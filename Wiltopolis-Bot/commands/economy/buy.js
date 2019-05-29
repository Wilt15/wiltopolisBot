const Discord = require("discord.js");
const fs = require("fs");
const errors = require("../../utils/errors.js");
const items = JSON.parse(fs.readFileSync('./items.json', 'utf8'));
let cooldown = 1209600000;

module.exports.run = async (bot, message, args) => {

  let score = await bot.getScore(message.author.id, message.guild.id);
  let boost = await bot.getBoost(message.author.id, message.guild.id);
  if (!boost) {
    boost = {
      user: message.author.id,
      guild: message.guild.id,
      time: { coins: null, xp: null },
      multiplier: { coins: 1, xp: 1 }
    };
  }
  let categories = [];

  if (!args.join(" ")) {

    for (var i in items) {

      if (!categories.includes(items[i].type)) {
        categories.push(items[i].type)
      }

    }

    const embed = new Discord.MessageEmbed()
      .setDescription(`Available Items`)
      .setColor('#056EF7')

    for (var i = 0; i < categories.length; i++) {
      var tempDesc = '';

      for (var c in items) {
        if (categories[i] === items[c].type) {

          tempDesc += `${items[c].id}. ${items[c].name} - $${items[c].price} - ${items[c].desc}\n`;

        }

      }
      embed.addField(categories[i], tempDesc);

    }

    return message.channel.send({
      embed
    });

  }

  let itemID = '';
  let itemName = '';
  let itemPrice = 0;
  let itemDesc = '';

  for (var i in items) {
    if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase() || args[0] === items[i].id) {
      itemID = items[i].id;
      itemName = items[i].name;
      itemPrice = items[i].price;
      itemDesc = items[i].desc;
    }
  }

  if (itemID === '' || itemName === '') {
    return message.channel.send(`**Item ${args.join(" ").trim()} not found.**`)
  }

  if (score.coins < itemPrice) return errors.custom(message, "You don't enough coins!");

  if (itemName === 'XP Booster' || itemID === '1') {
    if (boost.multiplier.xp >= 2.5) {
      return errors.custom(message, `You already got the highest upgrade.`)
    } else {
      score.coins -= parseInt(itemPrice)
      message.channel.send('**You bought ' + `${boost.multiplier.xp + 0.5}x ` + itemName + '!**')
      boost.time.xp = Date.now()
      boost.multiplier.xp = boost.multiplier.xp + 0.5
    }
  }

  if (itemName === 'Coin Booster' || itemID === '2') {
    if (boost.multiplier.xp >= 2.5) {
      return errors.custom(message, `You already got the highest upgrade.`)
    } else {
      score.coins -= parseInt(itemPrice)
      message.channel.send('**You bought ' + `${boost.multiplier.coins + 0.5}x ` + itemName + '!**')
      boost.time.coins = Date.now()
      boost.multiplier.coins = boost.multiplier.coins + 0.5
    }
  }

  if (itemName === 'Nickname' || itemID === '3') {
    const nick = new Discord.MessageEmbed()
      .setAuthor(`${message.author.username}`, message.author.avatarURL())
      .setDescription(`Send me the nickname you would like to buy!`)
      .setFooter(`If you don't want a nickname anymore, type "cancel"`)
      .setColor("#4286f4")

    message.author.send(nick).then(msg => {
      const filter = m => m.author.id === message.author.id;
      const swears = require('../swears.js');
      var blacklisted = ["HeadTriXz", "Owner", "Bot", swears.list]
      const coll = new Discord.MessageCollector(msg.channel, filter, {
        max: "1"
      })

      coll.on("collect", m => {
        if (m.content === "cancel") {
          const cancel = new Discord.RichEmbed()
            .setDescription(`Canceled`)
          message.author.send(cancel)

          return;
        }

        if (m.content.includes(blacklisted)) {
          const blackl = new Discord.MessageEmbed()
            .setAuthor(m.author.username, m.author.avatarURL())
            .setDescription(`This nickname is not allowed.`)

        m.author.send(blackl)
          return;
        }

        message.member.setNickname(m.content)
    score.coins -= parseInt(`${itemPrice}`)
    message.channel.send('**You bought ' + itemName + '!**');
        const newnick = new Discord.MessageEmbed()
          .setAuthor(`${message.author.username}`, message.author.avatarURL())
          .setDescription(`Your nickname has successfully been set to ${m.content}!`)
          .setColor(`#00AE86`)
        message.author.send(newnick);
      }).catch(err => {
        console.log(err)
      })
    })
  }
  bot.setBoost(boost);
  bot.setScore(score);
}

module.exports.help = {
  name: "buy",
  aliases: ["shop", "store"],
  description: 'Allows you to buy some items.',
  usage: '<item-id>',
  category: 'economy'
}
