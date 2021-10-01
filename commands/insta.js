const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    if (args.length == 1) {
        message.channel.send(`https://www.instagram.com/pedrolobo08`);
    }else{
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
};