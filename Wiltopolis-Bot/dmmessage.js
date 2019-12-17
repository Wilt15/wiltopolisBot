const Discord = require("discord.js")

module.exports = async (bot, message) => {
  try {
  if (message.channel.type === "dm") {
    const guild = bot.guilds.get("515339083946393601");
    if (guild) {
      let channel = guild.channels.find(c => c.name === `support-${message.author.id}`);
      if (!channel) {
        channel = await guild.channels.create(`support-${message.author.id}`, { parent:"579374804289716224", topic:`w!close to close the Ticket | ModMail for ${message.author.tag} | ID: ${message.author.id}`, type: 'text' });

        const mEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(message.content)
        .setFooter(`ID: ${message.author.id}`)
        .setTimestamp()
        .setColor("GREEN");

        if (message.attachments.array().length > 1) mEmbed.attachFiles(message.attachments.map(x => x.url))
        else if (message.attachments.array().length == 1) mEmbed.setImage(message.attachments.first().url)

        const dmEmbed = new Discord.MessageEmbed()
        .setAuthor("Thread Created", "https://cdn.discordapp.com/attachments/539574371853926420/579084479029706773/JPEG_20190518_011401.jpg")
        .setDescription(`Thank you for contacting us! A staff member will reply to you here as soon as possible.`)
        .setFooter(guild.name)
        .setTimestamp()
        .setColor("GREEN");

        message.author.send(dmEmbed);
        const taggedUser = mEmbed.author.username();
        channel.send('w!userinfo ${taggedUser}', mEmbed);

      } else {
        const mEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(message.content)
        .setFooter(`ID: ${message.author.id}`)
        .setTimestamp()
        .setColor("GREEN");

        if (message.attachments.array().length > 1) mEmbed.attachFiles(message.attachments.map(x => x.url))
        else if (message.attachments.array().length == 1) mEmbed.setImage(message.attachments.first().url)
        
        channel.send('@everyone', mEmbed);
      }
    }
  }
} catch (e) {
  console.error(e)
}
}
