const assert = (data, target) => data.toLowerCase() == target || data.toLowerCase().startsWith(target) || data.toLowerCase().includes(target),
  disc = async (ctx, target, type = "user") => {
    const members = ctx.guild.members.cache.filter(v => v.user.discriminator == target.substr(1));
    if (!members?.first()) return ctx.message[type == "user" ? "author" : "member"];
    ctx.channel.send(ctx.util.embeds.collectorEmbed(`${members.size} members have the ${target.slice(0, 5)} discriminator. Respond with the index of the one you want.\n\n${members.map((v, i) => `${i + 1} | ${v.user.tag} (${v.user.id})`).join("\n")}`, "1 minute", true));
    let index;
    try {
      index = (await ctx.channel.awaitMessages((m) => m.author.id == ctx.author.id, { max: 1, time: 60000, errors: ["time"] })).first()
    } catch { 
      ctx.respond(ctx.util.embeds.errorEmbed("You didn't respond in time!"))
      return ctx.message[type == "user" ? "author" : "member"];
    }
    if (isNaN(parseInt(index))) { ctx.respond(ctx.util.embeds.errorEmbed("Please send a valid number.")); return ctx.message[type == "user" ? "author" : "member"]; }
    index = parseInt(index);
    if (!members.map(v => v)[index]) { ctx.respond(ctx.util.embeds.errorEmbed("That user doesn't exist!")); return ctx.message[type == "user" ? "author" : "member"]; }
    return eval(`members.map(v => v)[index]${type == "user" ? ".user" : ""}`);
  }

module.exports.member = async (ctx, target) => (target.startsWith("#") ? await disc(ctx, target, "member") : (await ctx.guild.members.fetch(target.replace(/[^\d]+/g, ""), true).catch(e => null)) ?? (target.startsWith("^") ? ctx.util.powerof(target.match(/\^/g).length, ctx.message).author : ctx.guild.members.cache.find(v => assert(v.user.id, target.replace(/[^\d]+/g, "")) || assert(v.displayName, target) || assert(v.user.tag, target) || assert(v.user.username, target))));
module.exports.user = async (ctx, target) => (target.startsWith("#") ? await disc(ctx, target, "user") : (await ctx.client.users.fetch(target.replace(/[^\d]+/g, ""), true).catch(e => null)) ?? (target.startsWith("^") ? ctx.util.powerof(target.match(/\^/g).length, ctx.message).author : ctx.client.users.cache.find(v => assert(v.id, target.replace(/[^\d]+/g, "")) || assert(v.tag, target) || assert(v.username, target))));
