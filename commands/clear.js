const config = require("../config.json");

//Command to clear messages between 1-100 (incuding)
module.exports.run = async (bot, message, args) => {
    if (args.length == 2) {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            var qtdMensagens = parseFloat(args[1]) + 1;
            if (!Number.isNaN(qtdMensagens) && qtdMensagens <= 100 && qtdMensagens>=1) {
                message.channel.bulkDelete(qtdMensagens).then(messages => {
                    message.channel.send(`\`${messages.size-1}\` Messages Cleared!  🧻 `).then(message => setTimeout(() => message.delete(), 5000));
                });
            }else{
                message.channel.send(`To avoid bugs choose a number between \`1-99\` (incuding).`);
            }
        }else {
            message.channel.send(`You don´t have permissions for this command!`);
        }
    }else{
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}