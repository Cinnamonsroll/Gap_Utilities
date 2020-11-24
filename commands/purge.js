const Discord = require('discord.js');

module.exports = {
    help: {
        "name": ">purge",
        "id": "purge",
        "aliases": [
            "purge",
            'p'
        ],
        "desc": "Purges messages from the channel.",
        "example": ">purge 10"
    },
    /**
     * @param {Discord.Client} bot
     * @param {Discord.Message | Discord.PartialMessage} msg
     * @param {string[]} args
     */
    run: (bot, msg, args) =>
    {
        if (!msg.member.hasPermission('MANAGE_MESSAGES')) return msg.reply('you need to have the `MANAGE_MESSAGES` permission to execute this command.');
        // let _ = new Discord.MessageEmbed({
        //     color: "black",
        //     title: "This command is coming soon!",
        //     description: "This command is currently under construction!"
        // });
        // return msg.channel.send(_);

        let purgeNumber = Number(args[1]);

        if (!purgeNumber) return msg.reply('please specify a number of messages to purge.');

        // @ts-ignore
        msg.channel.bulkDelete(purgeNumber + 1);
    }
};;;