const Discord = require('discord.js');
const idify = require('../misc/idify');
let embeds = require('../misc/embeds');

module.exports = {
    help: {
        "name": ">kick",
        "id": "kick",
        "aliases": [],
        "desc": "Kick members of the server.",
        "example": ">kick 770232718339604522 Get out",
        "category": "moderation",
        "whitelisted": false
    },
    /**
     * @param {Discord.Client} bot
     * @param {Discord.Message | Discord.PartialMessage} msg
     * @param {string[]} args
     * @param {firebase.default.database.Database} db
     */
    run: async (bot, msg, args, db) =>
    {
        
        if (!msg.guild.me.hasPermission('KICK_MEMBERS')) return msg.channel.send(embeds.permissionsMissing('ban_members'));
        // @ts-ignore
        if (!msg.member.hasPermission('KICK_MEMBERS')) if ((await db.ref(`settings/${msg.guild.id}/authorOverride`).get()).val() && (msg.author.id === "728342296696979526")) { } else
        {
            const mw = await msg.channel.send(embeds.userPermissionsMissing('kick_members')); setTimeout(() =>
            {
                mw.delete();
                return msg.delete().catch(e => null);
            }, 5000);
        }
        if (!args[1]) return msg.channel.send(new Discord.MessageEmbed({color: "RED", description:`<:redTick:796095862874308678> You didn't specify a user to kick!`}))
        let err = false, target;
        try { target = await msg.guild.members.fetch(idify(args[1])); } catch { return msg.channel.send(new Discord.MessageEmbed({color: "RED", description:`<:redTick:796095862874308678> I couldn't find a user from the text \`${args[1]}\`!`})) }
        if (!target?.bannable) return msg.channel.send(new Discord.MessageEmbed({color: "RED", description:`<:redTick:796095862874308678> I can't kick that user because they are higher than me in the role heirarchy! Please move my role up and try again.`}));
        target.user.send(new Discord.MessageEmbed({ description: `You were **kicked** from __${msg.guild.name}__ for \`${args[2] ? args.slice(2) : "No reason specified."}\`.`, color: "RED", footer: `Server ID: ${msg.guild.id}\nOwner: ${msg.guild.owner ? msg.guild.owner.tag : (await msg.guild.members.fetch(msg.guild.ownerID)).tag} (${msg.guild.ownerID})`}))
        await target.kick({ reason: `[ Kick by ${msg.author.tag} ] ${args[2] ? args.slice(2) : "No reason specified."}`}).catch(r => { err = true; msg.react('❌'); return msg.channel.send(new Discord.MessageEmbed({color: "RED", description:`<:redTick:796095862874308678> I couldn't kick that user.`})) });
        if (err) return;
        msg.react('✅');
        msg.channel.send(new Discord.MessageEmbed({description:`<:greenTick:796095828094615602> Kick **${(await bot.users.fetch(idify(args[1]))).tag}** for \`${args[2] ? args.slice(2).join(" ") : "No reason specified"}\`.`,color:"GREEN"}));
    }
};