module.exports.run = async (a, b, args, d, e, ctx) => {
  if (!ctx.args[2]) return ctx.respond("Incorrect usage; should have at least two parameters (`{type: string} {user: ResolveableUser}`)");
  let usr = ((await ctx.client.users.fetch(args[1], true).catch(e => null)) ?? ctx.guild.members.cache.find(v => v.user.id == args[2] || v.displayName == args[2] || v.displayName.startsWith(args[2]) || v.displayName.includes(args[2]) || v.user.tag == args[2] || v.user.username == args[2] || v.user.username.startsWith(args[2]) || v.user.username.includes(args[2]))?.user) ?? ctx.message.author;
  usr = usr?.id
  switch (args[1]) {
    case "check":
      const data = ctx.db.get(`blacklist.${usr}`);
      return ctx.respond(`**${ctx.client.users.cache.get(usr).tag}** is ${data ? "" : "__not__ "}blacklisted${data ? "for `" + data + "`." : ""}.`)
    case "add":
      ctx.db.set(`blacklist.${usr}`, ctx.args.slice(3).join(" ") == "" ? "No reason specified." : ctx.args.slice(3).join(" "));
      return ctx.respond(`Successfully blacklisted **${ctx.client.users.cache.get(usr).tag}**.`)
    case "remove":
    case "rm":
      ctx.db.delete(`blacklist.${usr}`);
      return ctx.respond(`Successfully unblacklisted **${ctx.client.users.cache.get(usr).tag}**.`)
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