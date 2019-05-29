const Discord = module.require("discord.js");
const errors = require("../../utils/errors.js");
const help = require("../../utils/help.js");

module.exports.run = async (bot, message, args) => {
  if (args[0] == "help") return help.custom("!rps <choice>");
  let rps = ["scissors", "paper", "rock"];
  if (!rps.includes(args[0].toLowerCase())) return errors.custom(message, "Please choose Rock, Paper or Scissors.");
  let computerChoice = Math.random();
  if (computerChoice < 0.33) computerChoice = 'Rock';
  else if (computerChoice > 0.66) computerChoice = 'Paper';
  else(computerChoice = 'Scissors')
  let userChoice = args[0].toLowerCase()

  function Uc(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const embed = new Discord.MessageEmbed()
    .setAuthor("Game Drawn!", message.author.avatarURL())
    .addField("You Chose:", Uc(args[0]), true)
    .addField("I Choose:", computerChoice, true)
    .setColor("#056EF7")

  const botwon = new Discord.MessageEmbed()
    .setAuthor("I Won!", message.author.avatarURL())
    .addField("You Chose:", Uc(args[0]), true)
    .addField("I Choose:", computerChoice, true)
    .setColor("#056EF7")

  const userwon = new Discord.MessageEmbed()
    .setAuthor("You Won!", message.author.avatarURL())
    .addField("You Chose:", Uc(args[0]), true)
    .addField("I Choose:", computerChoice, true)
    .setColor("#056EF7")

  if (userChoice = 'rock') {
    if (computerChoice === 'Rock') {
      return message.channel.send(embed);
    } else
    if (computerChoice === 'Paper') {
      return message.channel.send(botwon);
    } else
    if (computerChoice === 'Scissors') {
      return message.channel.send(userwon);
    }
  } else
  if (userChoice = 'paper') {
    if (computerChoice === 'Rock') {
      return message.channel.send(botwon);
    } else
    if (computerChoice === 'Paper') {
      return message.channel.send(embed);
    } else
    if (computerChoice === 'Scissors') {
      return message.channel.send(userwon);
    }
  } else
  if (userChoice = 'scissors') {
    if (computerChoice === 'Rock') {
      return message.channel.send(botwon);
    } else
    if (computerChoice === 'Paper') {
      return message.channel.send(userwon);
    } else
    if (computerChoice === 'Scissors') {
      return message.channel.send(embed);
    }
  }
}

module.exports.help = {
  name: "rps",
  aliases: [],
  description: 'Rock Paper Scissors with the bot.',
  usage: '[choice]',
  category: 'fun'
}
