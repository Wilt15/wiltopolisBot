const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
const serverQueue = bot.queue.get(message.guild.id);
if (!serverQueue) {
  const queueConstruct = {
    textChannel: message.channel,
    voiceChannel: voiceChannel.channel,
    requestedBy: message.author,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
    loop: false
  };
  bot.queue.set(message.guild.id, queueConstruct);
}

  if (args[0] === "song") {
    serverQueue.loop = "song";
    message.channel.send("🔂 **Enabled!** (Song)")
  } else if (args[0] === "playlist") {
    serverQueue.loop = "queue";
    message.channel.send("🔁 **Enabled!** (Playlist)")
  } else {
    if (serverQueue.loop == false) {
      serverQueue.loop = "song";
      message.channel.send("🔂 **Enabled!** (Song)")
    } else {
      serverQueue.loop = false;
      message.channel.send("🔂 **Disabled!**")
    }
  }

}

module.exports.help = {
  name: "loop",
  aliases: ["repeat"],
  description: 'Loop the currently playing song or playlist.',
  usage: '<song | playlist>',
  category: 'music'
}
