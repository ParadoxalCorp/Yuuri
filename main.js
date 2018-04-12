'use strict';

const fs = require('fs');
const { join } = require('path');
const { Base } = require('eris-sharder');

class Yuuri extends Base {
    constructor(bot) {
        super(bot);

        //If true, this would ignore all messages from everyone besides the owner
        this.maintenance = false;
        this.collection = require('./util/helpers/collection');
        this.config = require('./config');
        this.prefixes = this.config.prefix ? [this.config.prefix] : [];
        this.stats;
    }

    launch() {
        Object.assign(this, require('./util')(this));
        this.ratelimited = new this.collection();
        //This will be filled with mentions prefix once ready
        this.commands = new this.collection();
        this.aliases = new this.collection();
        this.loadCommands();
        this.loadEventsListeners();
        this.bot.on('ready', this.ready.bind(this));

        if (this.database) {
            this.database.init();
        }

        this.ready();
    }

    loadCommands() {

        const categories = fs.readdirSync(join(__dirname, 'commands'));
        let totalCommands = 0;
        for (let i = 0; i < categories.length; i++) {
            let thisCommands = fs.readdirSync(join(__dirname, 'commands', categories[i]));
            totalCommands = totalCommands + thisCommands.length;
            thisCommands.forEach(c => {
                try {
                    const command = require(join(__dirname, 'commands', categories[i], c));
                    //Add the command and its aliases to the collection
                    if (!process.argv.includes('--no-db') || !command.conf.requireDB) {
                        this.commands.set(command.help.name, command);
                        command.conf.aliases.forEach(alias => {
                            this.aliases.set(alias, command.help.name);
                        });
                    }
                } catch (err) {
                    this.log.error(`Failed to load command ${c}: ${err.stack || err}`);
                }
            });
        }
        this.log.info(`Loaded ${this.commands.size}/${totalCommands} commands`);
    }

    loadEventsListeners() {
        //Load events
        const events = fs.readdirSync(join(__dirname, 'events'));
        let loadedEvents = 0;
        events.forEach(e => {
            try {
                const eventName = e.split(".")[0];
                const event = require(join(__dirname, 'events', e));
                loadedEvents++;
                this.bot.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, 'events', e))];
            } catch (err) {
                this.log.error(`Failed to load event ${e}: ${err.stack || err}`);
            }
        });
        this.log.info(`Loaded ${loadedEvents}/${events.length} events`);
    }

    async ready() {
        if (!this.bot.user.bot) {
            this.log.error(`Invalid login details were provided, the process will exit`);
            process.exit(0);
        }
        this.prefixes.push(`<@!${this.bot.user.id}>`, `<@${this.bot.user.id}>`);
        process.send({ name: "info", msg: `Logged in as ${this.bot.user.username}#${this.bot.user.discriminator}, running Yuuri ${require('./package').version}` });
        this.bot.shards.forEach(s => {
            s.editStatus("online", {
                name: `${this.config.prefix} help for commands | Shard ${s.id}`
            });
        });
    }
}

module.exports = Yuuri;