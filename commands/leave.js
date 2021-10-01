const config = require("../config.json");

//Command to the bot leave the voice channel
module.exports.run = async (bot, message, args) => {

    if (args.length == 1) {
        const queue = bot.queues.get(message.guild.id);
        if (!queue) {
            return message.channel.send("There is no music playing!");
        }
        if (!(message.member.roles.cache.find(r => r.id === config.roleDJ))) {
            return message.channel.send(`You don´t have permissions for this command!`);
        }
        bot.queues = new Map();
        return queue.connection.disconnect();
    } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}