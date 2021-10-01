const config = require("../config.json");

//Command to kick members, admins can't be kick
module.exports.run = async (bot, message, args) => {
    var texto = "";
    for (i = 2; i < args.length; i++) {
        texto = texto + args[i] + " ";
    }
    if (args.length >= 3) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                if (!(message.mentions.users.first() === bot.user) && !(member.roles.cache.find(r => r.id === config.roleAdmin))) {
                    member.user.send(`You've been Kicked from Mauve's Bedroom.\n**Reason:**${texto}`).then(() => {
                        member.kick()
                        member.kick().then(() => {
                            message.reply(`Successfully Kicked ${member.user.tag}.`);
                        });
                    });
                } else {
                    message.channel.send(`You can't kick that person!`);
                }
            } else {
                message.channel.send(`Can't find that member!`);
            }
        }else {
            message.channel.send(`You don´t have permissions for this command!`);
        }
    } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}