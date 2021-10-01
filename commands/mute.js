const config = require("../config.json");

//Command to mute a member, admins can't be mute
module.exports.run = async (bot, message, args, timersMuted) => {

    if (args.length == 3) {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            const member = message.guild.member(message.mentions.users.first());
            if (!(message.mentions.users.first() === bot.user) && !(member.roles.cache.find(r => r.id === config.roleAdmin))) {
                if (member && message.mentions.users.first()) {
                    if ((args[2].slice(-1) === 's' || args[2].slice(-1) === 'm' || args[2].slice(-1) === 'h' || args[2].slice(-1) === 'd') && (!(Number.isNaN((parseInt(args[2].slice(-2))))))) {
                        if ((!member.roles.cache.find(role => role.id === config.roleMuted))) {
                            var aux;
                            switch (args[2].slice(-1)) {
                                case 's':
                                    var tempo = ((parseInt(args[2].substring(0, args[2].length - 1)) * 1000));
                                    aux = ' second';
                                    break;
                                case 'm':
                                    var tempo = ((parseInt(args[2].substring(0, args[2].length - 1))) * 1000 * 60);
                                    aux = ' minute';
                                    break;
                                case 'h':
                                    var tempo = ((parseInt(args[2].substring(0, args[2].length - 1))) * 1000 * 60 * 60);
                                    aux = ' hour';
                                    break;
                                case 'd':
                                    var tempo = ((parseInt(args[2].substring(0, args[2].length - 1))) * 1000 * 60 * 60 * 24);
                                    aux = ' day';
                                    break;
                            }
                            if (!(parseInt(args[2].substring(0, args[2].length - 1)) == 1)) {
                                aux = aux + 's';
                            }
                            if (tempo > 2073600000) {
                                message.channel.send(`Please use a valid limit less than \`24 days\`!`);
                            } else {
                                var roleMuted = message.guild.roles.cache.find(role => role.id === config.roleMuted);
                                await (member.roles.add(roleMuted));
                                doTimer(tempo, member, message, roleMuted, timersMuted);
                                message.channel.send(`${member.user.tag} has been muted for \`${args[2].substring(0, args[2].length - 1)}` + `${aux}\`.`);
                            }
                        } else {
                            message.channel.send(`${member.user.tag} is already muted!`);
                        }
                    } else {
                        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
                    }
                } else {
                    message.channel.send(`Can't find that member!`);
                }
            } else {
                message.channel.send(`You can't mute that person!`);
            }
        } else {
            message.channel.send(`You don´t have permissions for this command!`);
        }
    } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}

function doTimer(tempo, member, message, roleMuted, timersMuted) {
    var timerMute = setTimeout(function () {
        if ((member.roles.cache.find(role => role.id === config.roleMuted))) {
            member.roles.remove(roleMuted);
            message.channel.send(`${member.user.tag} unmuted.`);
        }
    }, tempo)
    timersMuted[member.user.id] = timerMute;
}