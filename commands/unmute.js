const config = require("../config.json");

//Command to unmute a mute member.
module.exports.run = async (bot, message, args,timersMuted) => {
    if (args.length == 2) {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                var roleMuted = message.guild.roles.cache.find(role => role.id === config.roleMuted);
                if ((member.roles.cache.find(role => role.id === config.roleMuted))) {
                    member.roles.remove(roleMuted);
                    message.channel.send(`${member.user.tag} unmuted!`);
                    clearTimeout(timersMuted[member.user.id]);
                } else {
                    message.channel.send(`You cannot unmute a member who isn't muted!`);
                }
            } else {
                message.channel.send(`Can't find that member!`);
            }
        } else {
            message.channel.send(`You don´t have permissions for this command!`);
        }
    } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}