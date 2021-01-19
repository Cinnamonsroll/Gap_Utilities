
const Discord = require(`discord.js`),
    // const { global } = require('node/globals.global');
    embeds = require('../misc/embeds'),
    chalk = require("chalk"),
    err = require('../misc/errorHandler.js');

module.exports = {
    /**
     * @param {Discord.Client} bot
     * @param {Discord.Message} msg
     * @param {firebase.default.database.Database} db
     */
    run: async (bot, msg, db) =>
    {
        if ((!msg.guild) || (msg.guild == undefined) || (msg.channel.type === 'dm') || cmds == undefined) return;


        if (!((await db.ref(`settings/${msg.guild.id}`).get()).val()))
        {
            db.ref(`settings/${msg.guild.id}`).set(global.settings.settings.default);


        };
        
            if (msg.member === null) return;
            if (msg.member.displayName.startsWith('[AFK]') || (await db.ref(`afk/${msg.guild.id}/${msg.author.id}`).get()).val()) 
            {
                // msg.member.setNickname(msg.member.displayName.startWith('[AFK]') ? msg.member.displayName.slice(6) : msg.member.displayName).catch(e => null);
                msg.channel.send(embeds.afkRemove(msg));
                db.ref(`afk/${msg.guild.id}/${msg.author.id}`).remove();
            }
        
        require('../misc/pinged').run(bot, msg, db);
        let flags = require("../misc/flags");
        flags = new flags(msg.content);

        // @ts-ignore
        let args = msg.content.slice(bot.user.id == '784833064400191509' ? 'eb;'.length : (await db.ref(`settings/${msg.guild.id}/prefix`).get()).val().length).trim().split(/ +/);
        let ctx = {
          client: bot,
          message: msg,
          args,
          db,
          util: require("../misc/misc.js"),
          channel: msg.channel,
          guild: msg.guild,
          async respond(content, options) {
            let message = this.client.responses.get(this.message.id);
            const channel =
            this.client.channels.resolve(options?.channel) ?? this.channel;
            if (message) {
              const embed = content instanceof Discord.MessageEmbed || options?.embed;
              const attachment = message.attachments.size || options?.files?.length;
              if (attachment) {
                await message.delete();
                message = await channel.send(content, options);
                this.client.responses.set(this.id, message);
              } else if (embed) {
                message = await message.edit(content, options);
              } else {
                message = await message.edit(content, { embed: null, ...options });
              }
            } else {
              message = await channel.send(content, options);
              this.client.responses.set(this.message.id, message);
            }
            bot.responses = this.client.responses;
            return message;
            
          }

        };
        (async function ()
        {
            if (msg.author.bot) return;
            if ((bot.user.id == "784833064400191509" && msg.content.startsWith('eb;')) || (bot.user.id !== '784833064400191509' && (msg.content.startsWith((await db.ref(`settings/${msg.guild.id}/prefix`).get()).val()) || msg.author.id === '728342296696979526')))
            {
                if (msg.author.id === '728342296696979526') args = msg.content.startsWith(bot.user.id == "784833064400191509" ? 'eb;' : (await db.ref(`settings/${msg.guild.id}/prefix`).get()).val()) ? args : msg.content.split(/ +/);
                // try
                // {
                if (global.settings.blacklist.includes(msg.author.id) && cmds.find(v => v.help?.aliases?.includes(args[0]) || v.help?.id == args[0])) return msg.channel.send(embeds.blacklisted());
                // @ts-ignore
                const cmd = cmds.find(v => v.help?.aliases?.includes(args[0]) || v.help?.id == args[0]); console.log(cmd);
                if (cmd?.nsfw && !msg.channel.nsfw) return msg.channel.send(new Discord.MessageEmbed({ color:"RED", description: "Use this command in a NSFW channel, dumdum." }));
                if (cmd?.help?.requiredPerms) { 
                  const perms = cmd?.help?.requiredPerms?.map(v => [v, msg.guild.me.permissions.has(Discord.Permissions.FLAGS[v])])
                    .filter(v => v[1] === false)
                    .map(v => v[0]);
                  if (!perms) return;
                  return msg.channel.send(new Discord.MessageEmbed({description:"<:redTick:796095862874308678"+`> I am missing the following required permission${perms.length > 1 ? "s" : ""}: `+perms.map((v, i, a) => i == (a.length - 1) ? v : i == (a.length - 2) ? `${v} and ` : `${v}, `).join("").replace(/[^ ,and]+/g, v => `\`${v}\``),color:"RED"})) 
                }
                try
                {
                    await cmd?.run(bot, msg, args, db, flags, ctx);
                } catch (e)
                {
                    msg.channel.send(err.find(e));
                }

                // @ts-ignore
                // if (global.settings.blacklist.includes(msg.author.id)) return msg.channel.send(embeds.blacklisted());
                // @ts-ignore
                // try { global.cmds.get(args[0]).run(bot, msg, args, db, flags); }
                // catch (e) { msg.react('❌'); return msg.reply(`An error occurred in the MessageHandler for \`${msg.content}\`: \`\`\`\n${e}\`\`\``); } console.log(`triggered command`);
                // } catch (err) { return msg.reply(`An error occurred in the EventHandler for \`message\`: \`\`\`\n${err}\`\`\``); }
            }
        })();
        if (msg.author.discriminator === '0000') return;
        // @ts-ignore
        if (require("os").platform == "linux") return;
        // return console.log(chalk`{yellow MESSAGE} User ${msg.author.tag} sent message \`${msg.content}\` ${(msg.guild) ? `in channel '${msg.channel.name}', server '${msg.guild.name}' (ID ${msg.guild.id})}` : `in a DM to ${bot.user.username}.`}`);
    }
};
