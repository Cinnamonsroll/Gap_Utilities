/* eslint-disable @typescript-eslint/no-var-requires */
const Discord = require('discord.js');
let embeds = require('../misc/embeds');
const request = require('request'),
    fetch = require('node-fetch');

module.exports = {
    help: {
        "name": ">fuck",
        "id": "fuck",
        "aliases": [

        ],
        "desc": "Gets some hentai fucking each other idk I never tested the endpoint",
        "example": ">fuck",
        "category": "nsfw",
        "whitelisted": false
    },
    nsfw: true,
    /**
     * @param {Discord.Client} bot
     * @param {Discord.Message | Discord.PartialMessage} msg
     * @param {string[]} args
     */
    run: async (bot, msg, args) =>
    {
        if (!(await (require('../misc/vbapi').voted(bot.user.id, msg.author.id))).voted && !(require('../whitelist').includes(msg.author.id))) return msg.channel.send(new Discord.MessageEmbed({
            description: `<:redTick:796095862874308678> I couldn't execute this NSFW command because you haven't voted on <https://voidbots.net/bot/${bot.user.id}/vote>! Please note that it may take up to 5 minutes for your vote to register.`
        }));
        try
        {
            fetch('https://purrbot.site/api/img/nsfw/fuck/gif').then(res => res.json()).then(async body =>
            {
                require("../misc/depression")(await msg.channel.send(new Discord.MessageEmbed({
                    color: 'BLACK',
                    footer: {
                        text: 'Powered by *Purr*'
                    },
                    image: { url: body.link }
                })), msg);
            });
        } catch {

        }
    }
};
