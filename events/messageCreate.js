const Command = new(require('../util/helpers/Command'));

module.exports = async(client, message) => {
    if (message.author.bot) {
        return;
    }
    const command = await Command.parseCommand(message, client);
    if (!command) {
        return;
    }
    let userEntry = await client.database.getUser(message.author.id);
    if (!userEntry) {
        userEntry = await client.database.set(client.refs.userEntry(message.author.id))
            .catch(err => {
                client.emit("error", err);
                return message.channel.createMessage(`:x: An error occurred`);
            });
    }
    if (userEntry.blacklisted) {
        return;
    }
    if (command.conf.guildOnly && !message.channel.guild) {
        return message.channel.createMessage(`:x: This command may only be used in guilds and not in private messages`);
    }
    const hasPermissions = Command.hasPermissions(message, client, command.conf.requirePerms);
    if (!Array.isArray(hasPermissions)) {
        require(`../commands/${command.help.category}/${command.help.name}`).run(client, message, message.content.split(" "))
            .catch(err => {
                client.emit("error", err, message);
            });
    } else {
        if (hasPermissions.includes("sendMessages")) {
            return;
        }
        message.channel.createMessage(`:x: I need the following permission(s) to run that command: ` + hasPermissions.map(p => `\`${p}\``).join(', '));
    }
};