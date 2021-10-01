const Discord = require("discord.js");
const config = require("../config.json");
const ytdl = require('ytdl-core')
const search = require('yt-search');

//Command to play a music
module.exports.run = async (bot, message, args) => {

  if (args.length === 2 && ytdl.validateURL(args[1])) {
    if (message.guild.me.voice.channel && (message.member.voice.channel !== message.guild.me.voice.channel)) {
      return message.channel.send(`You must be in the same channel as ${message.client.user}`);
    }
    if (!message.member.voice.channel) {
      return message.channel.send("You need to join a voice channel first!");
    }
    songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
      request: message.member.user.tag
    };
    const queue = bot.queues.get(message.guild.id);
    if (queue && queue.songs.length == 0) {
      queue.songs.push(song);
      message.channel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`);
      playSong(bot, message, song);
    } else {
      if (queue) {
        queue.songs.push(song);
        message.channel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`);
        bot.queues.set(message.guild.id, queue);
      } else {
        playSong(bot, message, song);
      }
    }
  } else {
    if (args.length > 2) {
      if (message.guild.me.voice.channel && (message.member.voice.channel !== message.guild.me.voice.channel)) {
        return message.channel.send(`You must be in the same channel as ${message.client.user}`);
      }
      if (!message.member.voice.channel) {
        return message.channel.send("You need to join a voice channel first!");
      }
      var texto = "";
      for (i = 2; i < args.length; i++) {
        texto = texto + args[i] + " ";
      }
      search(texto, (err, result) => {
        if (result && result.videos.length > 0) {
          videoList = result;
          var videos = "";
          for (i = 0; i < 5; i++) {
            videos = videos + "\`" + (i + 1) + ":\` **" + result.videos[i].title + "**\n";
          }
          let OptionsEmbed = new Discord.MessageEmbed()
            .setColor("#ff9900")
            .setTitle("*Choose a video with !play/!p optionNumber*")
            .setDescription(videos);
          message.channel.send(OptionsEmbed);
          VF = true;
          setTimeout(function () {
            VF = false;
          }, 10000)
        } else {
          VF = false;
          return message.channel.send("Sorry I don't found nothing with that name!");
        }
      });
    } else {
      if (args.length === 2 && !Number.isNaN(parseInt(args[1]))) {
        if (parseInt(args[1]) >= 1 && parseInt(args[1]) <= 5 && VF) {
          const video = videoList.videos[parseInt(args[1]) - 1];
          const song = {
            title: video.title,
            url: video.url,
            request: message.member.user.tag
          };
          const queue = bot.queues.get(message.guild.id);
          if (queue) {
            queue.songs.push(song);
            message.channel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`);
            bot.queues.set(message.guild.id, queue);
          } else {
            playSong(bot, message, song);
          }
          VF = false;
        } else {
          message.channel.send(`No results, no song add.`);
        }
      } else {
        message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
      }
    }
  }
}

const playSong = async (bot, message, song) => {

  let queue = bot.queues.get(message.member.guild.id);
  if (!song) {
    if (queue) {
      setTimeout(function () {
        if (queue.songs.length == 0) {
          bot.queues = new Map();
          return queue.connection.disconnect();
        }
      }, 5000)
    }
  } else {
    if (!queue) {
      const conn = await message.member.voice.channel.join();
      queue = {
        volume: 100,
        connection: conn,
        dispatcher: null,
        songs: [song],
      };
    }

    queue.dispatcher = await queue.connection.play(ytdl(song.url, { highWaterMark: 1 << 25, filter: "audioonly" }));
    queue.dispatcher.on("finish", () => {
      queue.songs.shift();
      playSong(bot, message, queue.songs[0]);
    });

    bot.queues.set(message.member.guild.id, queue);
  }
};