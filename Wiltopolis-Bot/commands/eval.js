const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {
message.delete();
if (message.author.id !== bot.owner) return errors.noPerms(message, "BOT_OWNER")
  try {
      const code = args.join(" ");
      const evaled = message.content.includes("await") ? await eval(`(async () => { ${code} })()`) : eval(code);
      const evalEmbed = new Discord.MessageEmbed()
      .setAuthor("Eval", bot.user.avatarURL())
      .setColor("#056EF7")
      .addField("To Evaluate", code)
      .addField("Evaluated", evaled)
      .addField("Type Of", typeof evaled)

      message.channel.send(evalEmbed)
    } catch (err) {
      return errors.custom(message, `${{code:"xl"}}\n${err}`)
    }
}

module.exports.help = {
  name: "eval",
  aliases: ["e"],
  description: 'Allows you to control the bot.',
  usage: '[code]'
}
