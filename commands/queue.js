const Discord = require("discord.js");
const config = require("../config.json");

//Command to see the music queue
module.exports.run = async (bot, message, args) => {

    if (args.length == 1) {
        const queue = bot.queues.get(message.guild.id);
        if (!queue) {
            return message.channel.send("There is no music playing!");
        }

        var title = "🎶 Bugs Bronny Queue for " + message.guild.name;
        var nowPlaying = "*Now playing:*\n" + "**" + queue.songs[0].title + "** | \`Request by: " + queue.songs[0].request + "\`" + "\n\n";
        var nextPlaying = "*Up Next:*\n";
        var bodyNext = "";
        for (i = 1; i < queue.songs.length; i++) {
            bodyNext = bodyNext + "\`" + i + "\:` " + "**" + queue.songs[i].title + "** | \`Request by: " + queue.songs[i].request + "\`" + "\n";
        }

        if (bodyNext) {
            var description = nowPlaying + nextPlaying + bodyNext;
        } else {
            var description = nowPlaying + nextPlaying + "**No next video to play...**";
        }
        let queueEmbed = new Discord.MessageEmbed()
            .setColor("#ff9900")
            .setTitle(title)
            .setDescription(description);

        message.channel.send(queueEmbed);
    } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}