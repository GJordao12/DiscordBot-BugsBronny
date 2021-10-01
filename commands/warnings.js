const Discord = require("discord.js");
const config = require("../config.json");

//Command to see the warnings (our,list of people with x warnings and someone warns)
module.exports.run = async (bot, message, args, warns, MembersWarns) => {
    if (args.length == 2) {
        if (message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('KICK_MEMBERS')) {
            const member = message.guild.member(message.mentions.users.first());
            if (member) {
                if (MembersWarns.indexOf(member.user.id) === -1 || warns[MembersWarns.indexOf(member.user.id)] === 0) {
                    message.channel.send(`${member.user.tag} has \`0 warnings\`.`);
                } else {
                    warnings = warns[MembersWarns.indexOf(member.user.id)];
                    message.channel.send(`${member.user.tag} has \`${warnings} warnings\`.`);
                }
            } else {
                if (!Number.isNaN(parseInt(args[1]))) {
                    if (parseInt(args[1]) >= 1 && parseInt(args[1]) <= 3) {
                        var texto = "";
                        for (i = 0; i <= MembersWarns.length; i++) {
                            if (warns[i] === parseInt(args[1])) {
                                var membro = message.guild.members.cache.find(member => member.user.id === MembersWarns[i]);
                                texto = "" + texto + membro.user.tag + "\n";
                            }
                        }
                        if (texto === "") {
                            texto = "No one...";
                        }
                        var title = args[1] + " Warnings:";
                        let warningsEmbed = new Discord.MessageEmbed()
                            .setColor("#ff9900")
                            .setTitle(title)
                            .setDescription(texto)

                        message.channel.send(warningsEmbed);
                    } else {
                        message.channel.send(`Numbers of warnings are between \`1-3\` (including)!`);
                    }
                } else {
                    message.channel.send(`Can't find that member!`);
                }
            }
        } else {
            message.channel.send(`You don´t have permissions for this command!`);
        }
    } else {
        if (args.length == 1) {
            if (MembersWarns.indexOf(message.member.user.id) === -1 || warns[MembersWarns.indexOf(message.member.user.id)] === 0) {
                message.channel.send(`You have \`0 warnings\`.`);
            } else {
                warnings = warns[MembersWarns.indexOf(message.member.user.id)];
                message.channel.send(`You have \`${warnings} warnings\`.`);
            }
        } else {
            message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
        }
    }
}