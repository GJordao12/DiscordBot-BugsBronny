const config = require("../config.json");

//Funny Command send a random message "It's Heads" or "It's Tails".
module.exports.run = async (bot, message, args) => {
    if (args.length == 1) {
        var options = ['Heads', 'Tails'];
        message.channel.send(`It's ${options[Math.floor(Math.random() * (1 - 0 + 1)) + 0]}!`);
    }else{
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}