const Discord = require("discord.js");
const fs = require("fs");
const errors = require("../../utils/errors.js");

module.exports.run = async (bot, message, args) => {

function levDist(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}
try {
var roles = [];
message.guild.roles.forEach(role => {
  const distance = levDist(message.content.split("\n").find(x => x.toUpperCase().startsWith("R")).split(":").slice(1).join(" "), role.name);
  roles.push({
    distance: distance,
    role: role.name
  });
});
const sorted = roles.sort((a, b) => a.distance - b.distance);
const role = message.guild.roles.find(r => r.name === sorted[0].role);
const filter = m => m.author.id === message.author.id;
const coll = new Discord.MessageCollector(message.channel, filter, {max: "1"})
if (!message.content.split("\n").find(x => x.toUpperCase().startsWith("P")).split(":").slice(1).join(" ").includes("http")) return errors.custom(message, "No Portfolio supplied!")
if (sorted[0].distance > 0) {
  const ask = new Discord.MessageEmbed()
  .setAuthor(message.author.username, message.author.avatarURL())
  .addField("Error", `I could not find that role! Did you mean ${role.toString()}? Type **Yes** or **No**`)
  .setColor("#ff4d4d")

  message.channel.send(ask)
  coll.on("collect", m => {
    if (m.content.toLowerCase() === "yes") {
      m.channel.send(role.toString())
    } else if (m.content.toLowerCase() === "no") {
      const coll2 = new Discord.MessageCollector(m.channel, filter, {max: "1"})
      var i = 0;
      const noEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .addField("Other Roles", sorted.slice(1).map(x => `**${++i}.** ${message.guild.roles.find(r => r.name === x.role).toString()}`).slice(0, 5).join("\n"))
      .setColor("#ff4d4d")

      m.channel.send(noEmbed);
      coll2.on("collect", msg => {
        if (msg.content != parseInt(msg.content) || parseInt(msg.content) < 0 || parseInt(msg.content) > 5) return errors.custom(message, `The number **${msg.content}** is not a valid number!`)
        msg.channel.send(message.guild.roles.find(r => r.name === sorted[parseInt(msg.content)].role).toString())
      })
    }
  })


}
message.channel.send(role.toString());
console.log(sorted[0], sorted[0].role)
} catch (err) {
  console.error(err);
  errors.custom(message, "Incorrect usage.")
} 
};

module.exports.help = {
  name: "test",
  aliases: [],
  description: 'Show and change the config of the server.',
  usage: '[key] [value]',
  category: 'staff'
};
