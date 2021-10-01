const Discord = require("discord.js");
const config = require("../config.json");
const cheerio = require('cheerio');
const request = require('request');

//Command to see a random pug photo
module.exports.run = async (bot, message, args) => {

    if (args.length == 1) {
        var options = {
            url: "http://results.dogpile.com/serp?qc=images&q=" + "pug",
            method: "GET",
            headers: {
                "Accept": "text/html",
                "User-Agent": "Chrome"
            }
        };

        request(options, function (error, response, responseBody) {
            if (error) {
                return;
            }

            $ = cheerio.load(responseBody);

            var links = $(".image a.link");

            var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

            if (!urls.length) {

                return;
            }

            let pugEmbed = new Discord.MessageEmbed()
            .setColor("#ff9900")
            .setTitle("PUG")
            .setImage(urls[Math.floor(Math.random() * urls.length)]);

            message.channel.send(pugEmbed);
        });
    }else{
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
    }
}