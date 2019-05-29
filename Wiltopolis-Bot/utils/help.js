const Discord = require("discord.js");
const fs = require("fs");
let config = require("../config.json");

module.exports.custom = (message, custom) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Usage:")
        .setDescription(custom)
        .setColor("#4bd868")

    message.channel.send(embed)
}

module.exports.desc = (message, custom) => {
    let desc = new Discord.MessageEmbed()
      .setDescription(custom)
      .setColor("#ff4d4d")

    message.channel.send(desc)
}
