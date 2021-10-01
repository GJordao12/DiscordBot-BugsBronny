const config = require("../config.json");

//Command to softban a member, admins can't be softban
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
                    member.user.send(`You've been SoftBanned from Mauve's Bedroom.\n**Reason:**${texto}`).then(() => {
                        message.guild.members.ban(member, { days: 7, reason: texto }).then(() => {
                            message.guild.members.unban(member.id, { reason: "Softban" })
                                .then(() => {
                                    message.reply(`Successfully SoftBanned ${member.user.tag}.`);
                                });
                        });
                    });
                } else {
                    message.channel.send(`You can't softban that person!`);
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