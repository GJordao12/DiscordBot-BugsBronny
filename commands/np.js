const Discord = require("discord.js");
const config = require("../config.json");

//Command to show the music that are now playing
module.exports.run = async (bot, message, args) => {

    if (args.length == 1) {
        const queue = bot.queues.get(message.guild.id);
        if (!queue) {
            return message.channel.send("There is no music playing!");
        }

        var description = "**" + queue.songs[0].title + "** | \`Request by: " + queue.songs[0].request + "\`";
        
        let npEmbed = new Discord.MessageEmbed()
            .setColor("#ff9900")
            .setTitle("*🎶 Now Playing*")
            .setDescription(description)

        message.channel.send(npEmbed);
    }else{
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}