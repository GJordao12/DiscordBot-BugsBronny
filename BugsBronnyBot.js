const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

var membros = new Array();
var mensagens = new Array();
var MembersWarns = new Array();
var warns = new Array();
var timersMuted = new Array();
var timersFriendly = new Array();
var timersVeteran = new Array();
var timersRacoon = new Array();

bot.login(config.token);
bot.queues = new Map();

bot.on("ready", () => {
    console.log(`Ready`);
    bot.user.setPresence({ activity: { name: "twitch", type: "STREAMING", url: "https://www.twitch.tv/trymauve" }, status: "online" });
});

//Adicionar a Role "member" quando alguem entra no server e preparar timer para as outras.
bot.on('guildMemberAdd', member => {
    var roleNewMember = member.guild.roles.cache.find(role => role.id === config.roleNewMember);
    member.roles.add(roleNewMember);
    var roleFriendly = member.guild.roles.cache.find(role => role.id === config.roleFriendly);
    var roleVeteran = member.guild.roles.cache.find(role => role.id === config.roleVeteran);
    var roleRacoon = member.guild.roles.cache.find(role => role.id === config.roleRacoon);
    let nowDate = new Date();
    if ((nowDate.getMonth() + 6) > 11) {
        var month = nowDate.getMonth() + 6 - 11 - 1;
        dateFriendly = new Date(nowDate.getFullYear() + 1, month, nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds(), nowDate.getMilliseconds());
    } else {
        dateFriendly = new Date(nowDate.getFullYear(), month + 6, nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds(), nowDate.getMilliseconds());
    }
    doTimer(dateFriendly, member, roleNewMember, roleFriendly, timersFriendly);

    dateVeteran = new Date(nowDate.getFullYear() + 1, nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds(), nowDate.getMilliseconds());
    doTimer(dateVeteran, member, roleFriendly, roleVeteran, timersVeteran);

    dateRacoon = new Date(nowDate.getFullYear() + 2, nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds(), nowDate.getMilliseconds());
    doTimer(dateRacoon, member, roleVeteran, roleRacoon, timersRacoon);
});

//comandos com "!" e role de mensagens.
bot.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.content.startsWith(`<@!${bot.user.id}`) || message.content.startsWith(`<@${bot.user.id}`)) return;

    if (membros == null || membros.length == 0) {
        membros[0] = message.member.user.id;
        mensagens[0] = 1;
    } else {
        if (membros.indexOf(message.member.user.id) === -1) {
            membros[membros.length] = message.member.user.id;
            mensagens[mensagens.length] = 1;
        } else {
            mensagens[membros.indexOf(message.member.user.id)] = mensagens[membros.indexOf(message.member.user.id)] + 1;
        }
    }

    var roleRookie = message.guild.roles.cache.find(role => role.id === config.roleRookie);
    var roleActive = message.guild.roles.cache.find(role => role.id === config.roleActive);
    var roleDedicated = message.guild.roles.cache.find(role => role.id === config.roleDedicated);
    var roleTooAddicted = message.guild.roles.cache.find(role => role.id === config.roleTooAddicted);
    var roleSomethingElse = message.guild.roles.cache.find(role => role.id === config.roleSomethingElse);
    var roleRemarkable = message.guild.roles.cache.find(role => role.id === config.roleRemarkable);
    var roleTopPog = message.guild.roles.cache.find(role => role.id === config.roleTopPog);

    switch (mensagens[membros.indexOf(message.member.user.id)]) {
        case 1000:
            message.member.roles.add(roleRookie);
            message.channel.send(`${message.member.user.tag} you are now \`Rookie\`.`);
            break;
        case 5000:
            message.member.roles.remove(roleRookie);
            message.member.roles.add(roleActive);
            message.channel.send(`${message.member.user.tag} you are now \`Active\`.`);
            break;
        case 10000:
            message.member.roles.remove(roleActive);
            message.member.roles.add(roleDedicated);
            message.channel.send(`${message.member.user.tag} you are now \`Dedicated\`.`);
            break;
        case 25000:
            message.member.roles.remove(roleDedicated);
            message.member.roles.add(roleTooAddicted);
            message.channel.send(`${message.member.user.tag} you are now \`Too Addicted\`.`);
            break;
        case 50000:
            message.member.roles.remove(roleTooAddicted);
            message.member.roles.add(roleSomethingElse);
            message.channel.send(`${message.member.user.tag} you are now \`Something Else\`.`);
            break;
        case 75000:
            message.member.roles.remove(roleSomethingElse);
            message.member.roles.add(roleRemarkable);
            message.channel.send(`${message.member.user.tag} you are now \`Remarkable\`.`);
            break;
        case 100000:
            message.member.roles.remove(roleRemarkable);
            message.member.roles.add(roleTopPog);
            message.channel.send(`${message.member.user.tag} you are now \`Top Pog\`.`);
            break;
    }

    if (!message.content.startsWith(config.prefixo)) return;

    var args = message.content.split(" ");
    var command = args[0].slice(1);
    if (command === command.toLowerCase()) {

        if (command === "p") {
            command = "play";
        }
        if (command === "youtube") {
            command = "yt";
        }
        if (command === "instagram") {
            command = "insta";
        }

        if (args.length >= 3 && (command === "kick" || command === "ban" || command === "softban")) {
            const member = message.guild.member(message.mentions.users.first());
            if (!(member.roles.cache.find(role => role.id === config.roleAdmin))) {
                membros.splice(membros.indexOf(member.user.id), 1);
                mensagens.splice(membros.indexOf(member.user.id), 1);
                clearTimeout(timersMuted[member.user.id]);
                clearInterval(timersFriendly[member.user.id]);
                clearInterval(timersVeteran[member.user.id]);
                clearInterval(timersRacoon[member.user.id]);
            }
        }

        try {
            let commandFile = require(`./commands/${command}.js`);
            delete require.cache[require.resolve(`./commands/${command}.js`)];
            if (command === "mute" || command === "unmute") {
                return commandFile.run(bot, message, args, timersMuted);
            } else {
                return commandFile.run(bot, message, args, warns, MembersWarns);
            }
        } catch (err) {
            message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
        }
    } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
});

function doTimer(date, member, roleOne, roleTwo, array) {
    var timerRole = setInterval(function () {
        let now = new Date().getTime();
        let t = date - now;
        if (!(t >= 0)) {
            member.roles.remove(roleOne);
            member.roles.add(roleTwo);
            const alertChannel = member.guild.channels.cache.find(channel => channel.id === config.alertChannel);
            alertChannel.send(`${member.user.tag} is now \`${roleTwo.name}\`.`);
            clearInterval(timerRole);
        }
    }, 1000)
    array[member.user.id] = timerRole;
}
