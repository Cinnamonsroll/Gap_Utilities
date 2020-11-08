let Discord = require("discord.js");
let child_process = require("child_process");
let error = require("../assets/Error");

// @ts-ignore
let whitelist = require("./../whitelist");

module.exports = {
    /**
     * @param {Discord.Client} bot
     * @param {Discord.Message} msg
     * @param {string[]} args
     */
    run: (bot, msg, args) =>
    {
        if (!(whitelist.includes(msg.author.id))) return msg.channel.send(new error.HardcodedWhitelistError(`unix`, msg.author.id).result);
        else
        {
            let proc = child_process.exec(msg.content.slice(5), (e, stdout, stderr) =>
            {
                let _ = new Discord.MessageEmbed()
                    .setTitle(`*NIX Command Results`)
                    .setColor("black")
                    .setFooter(`>unix (whitelisted)`)
                    .setDescription(`You asked for a *nix command, well, here is your *nix command.`)
                    .addField("`stdout`", `\`\`\`\n${stdout}\`\`\``)
                    .addField(`\`sterr\``, `\`\`\`\n${stderr}\`\`\``);
                msg.channel.send(_);

            });
        }
    }
};
