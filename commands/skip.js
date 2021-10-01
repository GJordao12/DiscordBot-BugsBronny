const config = require("../config.json");
const ytdl = require('ytdl-core')

//Command to skip a music
module.exports.run = async (bot, message, args) => {

  if (args.length == 1) {
    const queue = bot.queues.get(message.guild.id);
    if (!queue) {
      return message.channel.send("There is no music playing!");
    }

    if (!(message.member.roles.cache.find(r => r.id === config.roleDJ))) {
      return message.channel.send(`You don´t have permissions for this command!`);
    }

    if (queue.songs.length === 1) {
      message.channel.send(`No more videos to play...`);
      bot.queues = new Map();
      return queue.connection.disconnect();
    }

    queue.songs.shift();
    bot.queues.set(message.guild.id, queue);
    playSong(bot, message, queue.songs[0]);
  } else {
    message.channel.send(`Invalid Command, please check ${message.guild.channels.cache.find(channel => channel.id === config.commandsChannel)}!`);
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