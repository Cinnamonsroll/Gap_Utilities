const Discord = require('discord.js');
let embeds = require('../assets/embeds');

module.exports = {
    help: {
        "name": ">ping",
        "id": "eval",
        "aliases": [
            "ping",
            "pong"
        ],
        "desc": "Displays the bot join message.",
        "example": ">ping"
    },
    /**
     * @param {Discord.Client} bot
     * @param {Discord.Message | Discord.PartialMessage} msg
     * @param {string[]} args
     */
    run: async (bot, msg, args) =>
    {
        msg.channel.send(embeds.newGuild());
    }
};