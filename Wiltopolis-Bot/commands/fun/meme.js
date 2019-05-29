const Discord = require('discord.js');
const fetch = require('node-superfetch');

exports.run = async (client, message, args, color) => {
try {
        const { body } = await fetch
            .get('https://www.reddit.com/r/memes.json?sort=top&t=week')
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        const embed = new Discord.MessageEmbed()
        .setColor("#056EF7")
        .setAuthor(allowed[randomnumber].data.title)
        .setDescription("Posted by: " + allowed[randomnumber].data.author)
        .setImage(allowed[randomnumber].data.url)
        .addField("Other info:", "👍 " + allowed[randomnumber].data.ups + " | 💬 " + allowed[randomnumber].data.num_comments)
        .setFooter("Memes provided by r/memes")
        message.channel.send(embed)
    } catch (err) {
        return console.log(err);
    }
}

exports.help = {
  name: "meme",
  aliases: [],
  description: 'Get a random meme.',
  usage: '',
  category: 'fun'
}
