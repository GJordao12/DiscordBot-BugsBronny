const config = require("../config.json");

//Comand to ban a member, admins can't be ban
module.exports.run = async (bot, message, args) => {
    var texto = "";
    for (i = 2; i < args.length; i++) {
        texto = texto + args[i] + " ";
    }
    if (args.length >= 3) {
        if (message.member.hasPermission('BAN_MEMBERS')) {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                if (!(message.mentions.users.first() === bot.user) && !(member.roles.cache.find(r => r.id === config.roleAdmin))) {
                    member.user.send(`You've been Banned from Mauve's Bedroom.\n**Reason:**${texto}`).then(() => {
                        message.guild.members.ban(member, { days: 7, reason: texto })
                            .then(() => {
                                message.reply(`Successfully Banned ${member.user.tag}.`);
                            });
                    });
                } else {
                    message.channel.send(`You can't ban that person!`);
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