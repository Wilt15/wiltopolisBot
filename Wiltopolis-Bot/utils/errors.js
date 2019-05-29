const Discord = require("discord.js");
const fs = require("fs");
let config = require("../config.json");

module.exports.noPerms = (message, perm) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .addField("Insufficient Permission", `Permission needed\n${perm}`)
        .setColor(config.red);

    message.channel.send(embed)//.then(m => m.delete(5000));
}

module.exports.equalPerms = (message, user, perms) => {

    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor(config.red)
        .addField("Error", `That user has perms\n${perms}`);

    message.channel.send(embed)//.then(m => m.delete(5000));

}

module.exports.botuser = (message) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .addField("Error", "You cannot ban a bot.")
        .setColor(config.red);

    message.channel.send(embed)//.then(m => m.delete(5000));
}

module.exports.cantfindUser = (message) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .addField("Error", "Could not find that user.")
        .setColor(config.red);

    message.channel.send(embed)//.then(m => m.delete(5000));
}

module.exports.noRoles = (message) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .addField("Error", "They don't have that role.")
        .setColor(config.red);

    message.channel.send(embed)//.then(m => m.delete(5000));
}
module.exports.noReason = (message) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .addField("Error", "Please supply a reason.")
        .setColor(config.red);

    message.channel.send(embed)//.then(m => m.delete(5000));
}

module.exports.noTime = (message) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .addField("Error", "You didn't specify a time!")
        .setColor(config.red);

    message.channel.send(embed)//.then(m => m.delete(5000));
}

module.exports.custom = (message, custom) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .addField("Error", custom)
        .setColor(config.red);

    message.channel.send(embed)//.then(m => m.delete(5000));
}
