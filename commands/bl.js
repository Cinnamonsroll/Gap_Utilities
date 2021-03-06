module.exports.run = async (a, b, args, d, e, ctx) => {
  if (!ctx.args[2]) return ctx.respond(ctx.util.embeds.errorEmbed("Incorrect usage; should have at least two parameters (`{type: string} {user: ResolveableUser}`)"));
  let target = args.slice(2).join(" ").toLowerCase(),
  usr = ctx.util.get.user(ctx, target)
  if (!usr) return ctx.respond(ctx.util.embeds.errorEmbed("I could not find that user!"))
  usr = usr?.id
  switch (args[1]) {
    case "check":
      const data = ctx.db.get(`blacklist.${usr}`);
      return ctx.respond(ctx.util.embeds.neutralEmbed(`**${ctx.client.users.cache.get(usr).tag}** is ${data ? "" : "__not__ "}blacklisted${data ? " for `" + data + "`" : ""}.`, false))
    case "add":
      ctx.channel.send(ctx.util.embeds.collectorEmbed(`What reason should I add **${ctx.client.users.cache.get(usr).tag}** to the blacklist for?`, "1 minute", true))
      let reason;
      try {
      reason = (await ctx.channel.awaitMessages((m) => m.author.id == ctx.message.author.id, { max: 1, time: 60000, errors: ["time"] })).first().content
      } catch { return ctx.respond(ctx.util.embeds.errorEmbed("You didn't send a message in time!")) }
      if (!reason) return;
      if (reason == "cancel") return ctx.respond(ctx.util.embeds.neutralEmbed("Cancelled"))
      ctx.db.set(`blacklist.${usr}`, reason);
      return ctx.respond(ctx.util.embeds.okEmbed(`Successfully blacklisted **${ctx.client.users.cache.get(usr).tag}**.`))
    case "remove":
    case "rm":
      ctx.db.delete(`blacklist.${usr}`);
      return ctx.respond(ctx.util.embeds.okEmbed(`Successfully unblacklisted **${ctx.client.users.cache.get(usr).tag}**.`))
  }
}
module.exports.help = {
  name: ">bl",
  id: "bl",
  aliases: [ "blacklist" ],
  desc: "Yikes, an alias as a command name!",
  category: "owner",
  whitelisted: true,
  example: ">blacklist add Splatterxl#8999 bad boi",
}
