const config = require("../config.json");

//Command to delete a member warn.
module.exports.run = async (bot, message, args, warns, MembersWarns) => {
    if (args.length == 2) {
        if (message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('KICK_MEMBERS')) {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                if (MembersWarns.indexOf(member.user.id) === -1 || warns[MembersWarns.indexOf(member.user.id)] === 0) {
                    message.channel.send(`${member.user.tag} has \`0 warnings\`, you can't delete one!`);
                } else {
                    warns[MembersWarns.indexOf(member.user.id)] = warns[MembersWarns.indexOf(member.user.id)] - 1;
                    message.channel.send(`${member.user.tag} has now \`${warns[MembersWarns.indexOf(member.user.id)]} warnings\`.`);
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