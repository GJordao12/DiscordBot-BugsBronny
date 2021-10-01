const config = require("../config.json");

//Command to warn a member, admins can't be warn
module.exports.run = async (bot, message, args, warns, MembersWarns) => {
    if (args.length == 2) {
        if (message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('KICK_MEMBERS')) {
            const member = message.guild.member(message.mentions.users.first());
            if (!(message.mentions.users.first() === bot.user) && !(member.roles.cache.find(r => r.id === config.roleAdmin))) {
                if (member) {
                    if (MembersWarns == null || MembersWarns.length == 0) {
                        MembersWarns[0] = member.user.id;
                        warns[0] = 1;
                    } else {
                        if (MembersWarns.indexOf(member.user.id) === -1) {
                            MembersWarns[MembersWarns.length] = member.user.id;
                            warns[warns.length] = 1;
                        } else {
                            warns[MembersWarns.indexOf(member.user.id)] = warns[MembersWarns.indexOf(member.user.id)] + 1;
                        }
                    }

                    if (warns[MembersWarns.indexOf(member.user.id)] < 3) {
                        message.channel.send(`${member.user.tag} has now \`${warns[MembersWarns.indexOf(member.user.id)]} warnings\`.`);
                    }

                    if (warns[MembersWarns.indexOf(member.user.id)] === 3) {
                        warns[MembersWarns.indexOf(member.user.id)] = 0;
                        member.user.send(`You've been Banned from Mauve's Bedroom.\n**Reason:** 3 Warnings!`).then(() => {
                            message.guild.members.ban(member, { days: 7, reason: "3 Warnings!" })
                                .then(() => {
                                    message.reply(`${member.user.tag} reached the 3 warnings mark, congrats on the ban!`);
                                });
                        });
                    }
                } else {
                    message.channel.send(`Can't find that member!`);
                }
            } else {
                message.channel.send(`You can't warn that person!`);
            }
        } else {
            message.channel.send(`You don´t have permissions for this command!`);
        }
    } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}