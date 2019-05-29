const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if (!args[2]) return message.reply("Please ask a full question!");
  let replies = ["Yes.", "Without a doubt.", "Outlook good.", "Most likely.", "Very doubtful.", "Don't count on it.", "Outlook not so good.", "No.", "I don't know", "Ask later again.", "Reply hazy, try again", "Better not tell you now."]

  let result = Math.floor((Math.random() * replies.length));
  let question = args.slice(0).join(" ");

  let ballembed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setColor("#056EF7")
    .addField("Question", question)
    .addField("Answer", replies[result]);

  message.channel.send(ballembed);
}

module.exports.help = {
  name: "8ball",
  aliases: [],
  description: 'Tells you the answer to your question.',
  usage: '[question]',
  category: 'fun'
}
