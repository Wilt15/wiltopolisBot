const Discord = require("discord.js");
const MongoClient = require("mongodb").MongoClient;

module.exports.run = async (bot, message, args) => {
  MongoClient.connect(process.env.MONGODB_URI,
  {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 5000,
    ssl: true,
    sslValidate: false,
    useNewUrlParser: true
  }, async function(err, client) {

  var arr = await client.db("scores").collection("scores").find({guild: message.guild.id}).toArray();
  const top = arr.sort(function(a, b){return b.points-a.points});
  let slice1 = 0 + (10 * (parseInt(args[0]) - 1));
  let slice2 = 10 + (10 * (parseInt(args[0]) - 1));
  if (!args[0]) {
    slice1 = 0;
    slice2 = 10;
  }
const promises = top.slice(slice1, slice2).map(x => bot.users.get(x.user) || bot.users.fetch(x.user));
  let pages = Math.ceil((top.length / 10));
  let page = args[0]?args[0]:1;

  const embed = new Discord.MessageEmbed()
    .setAuthor(`Leaderboard | ${message.guild.name}`, message.guild.iconURL())
    .setColor("#056EF7")
    .setFooter(`Page ${page} of ${pages}`);

    Promise.all(promises)
      .then(users => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          const data = top.findIndex(x => x.user == user.id);

          embed.addField(`${data + 1}. ${users[i].username}`, `Total XP: **${top[data].points}**, Level: **${top[data].level}**`);
        }

        if (args[0]) {
          if (parseInt(args[0]) > pages || parseInt(args[0]) < 1) return;
          page = parseInt(args[0]);
          embed.setFooter(`Page ${page} of ${pages}`);

        }
        message.channel.send(embed).catch(console.error);
      })

    client.close()
});
};


module.exports.help = {
  name: "leaderboard",
  aliases: ["top", "lb"],
  description: 'Displays the top 10 users with the highest xp.',
  usage: '<page>',
  category: 'general'
};
