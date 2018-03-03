module.exports = {
    //Multiple "admins" of the bot, they will have access to most of the admins commands
    admins: ["your_ID", "trusted_collaborator_ID", "another_trusted_collaborator_ID"],
    prefix: "uwu.",
    ownerID: "your_ID",
    botID: "bot_ID",
    //The token of the bot application to connect to, it is required.
    token: "",
    database: {
        //Unless the database is on another server, the host should be localhost
        host: "localhost",
        //The port should be the client driver port, not the administrative HTTP connection nor the intracluster one
        port: 8080
    },
    //Additional API keys that the bot use for commands for example
    apiKeys: {
        raven: "",
    },
    //Some customizable bot features options, purpose is to be able to quickly change critical values without having to do so in 100 files 
    options: {}
};