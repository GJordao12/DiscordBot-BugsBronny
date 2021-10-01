const Discord = require("discord.js");
const config = require("../config.json");

//Command to see our avatar ou someone avatar
module.exports.run = async (bot, message, args) => {
    if (args.length == 1) {
        url = message.member.user.avatarURL("png", false, 64);
        title = message.member.user.username + "'s Avatar";
        doEmbed(url, title, message);
    } else {
        if (args.length == 2) {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                if (member.user.avatarURL("png", false, 64) !== null) {
                    url = member.user.avatarURL("png", false, 64);
                    title = member.user.username + "'s Avatar";
                    doEmbed(url, title, message);
                }
            } else {
                message.channel.send(`Can't find that member!`);
            }
        } else {
            message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
        }
    }
}

function doEmbed(url, title, message) {
    let avatarEmbed = new Discord.MessageEmbed()
        .setColor("#ff9900")
        .setTitle(title)
        .setImage(url);

    message.channel.send(avatarEmbed);
}