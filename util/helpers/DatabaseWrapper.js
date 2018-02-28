const log = require('../modules/log');
const sleep = require('../modules/sleep');

class DatabaseWrapper {
    constructor(client) {
        this.conn = {};
        this.guildData = rethink.db('data').table('guilds');
        this.rethink = require("rethinkdb");
        this.userData = rethink.db('data').table('users');
        this.client = client;
        this.users = new Map();
        this.guilds = new Map();
    }

    /** 
     * Initialize the database wrapper, this will start the automatic progressive caching of the database and dynamically handle disconnections
     * @returns {void}
     */
    async init() {
        const guildCursor = await this.guildData.changes({ squash: true, includeInitials: true, includeTypes: true }).run(conn).catch(err => Promise.reject(err));
        const userCursor = await this.userData.changes({ squash: true, includeInitials: true, includeTypes: true }).run(conn).catch(err => Promise.reject(err));

        guildCursor.on('data', (data) => {
            if (data.type === "remove") {
                this.guilds.delete(data.old_val.id);
            } else {
                this.guilds.set(data.new_val.id, data.new_val);
            }
        });

        userCursor.on('data', (data) => {
            if (data.type === "remove") {
                this.users.delete(data.old_val.id);
            } else {
                this.users.set(data.new_val.id, data.new_val);
            }
        });

        this.conn.on('close', async() => {
            log.warn('The connection with the database has been closed, commands using the database will be disabled until a successful re-connection has been made');
            this.client.commands
                .filter(c => c.conf.requireDB)
                .forEach(c => c.conf.disabled = ":x: This command uses the database, however the database seems unavailable at the moment");
            log.draft('reconnectingToDb', 'Reconnecting to the database...');
            let reconnected = false;
            for (let reconnected = false; !reconnected; reconnected) {
                await sleep(15000);
                await this.connect()
                    .then(conn => {
                        reconnected = true;
                        this.client.commands
                            .filter(c => c.conf.requireDB)
                            .forEach(c => c.conf.disabled = false);
                        return log.endDraft('reconnectingToDb', `Successfully reconnected to the database, commands have been enabled back`);
                    })
                    .catch();
            }
        });
    }

    async connect(host = this.client.config.database.host, port = this.client.config.database.port) {
        this.rethink.connect({ host: host, port: port })
            .then(conn => {
                this.conn = conn;
                return conn;
            })
            .catch(err => {
                Promise.reject(err);
            });
    }

    /**
     * Get a guild database entry
     * @param {string} id - The unique identifier of the guild to get
     * @returns {Promise<object>} - The guild entry object, or null if not in the database
     */
    async getGuild(id) {
        if (this.guilds.has(id)) {
            return this.guilds.get(id);
        }
        this.guildData.get(id).run(this.conn)
            .then(data => {
                return data;
            })
            .catch(err => {
                Promise.reject(err);
                this.client.emit('error', err);
            });
    }

    /**
     * Get a user database entry
     * @param {string} id - The unique identifier of the user to get
     * @returns {Promise<object>} - The user entry object, or null if not in the database
     */
    async getUser(id) {
        if (this.users.has(id)) {
            return this.users.get(id);
        }
        this.userData.get(id).run(this.conn)
            .then(data => {
                return data;
            })
            .catch(err => {
                Promise.reject(err);
                this.client.emit('error', err);
            });
    }

    /**
     * 
     * @param {object} data - The data object to update/insert in the database 
     * @param {string} type - Can be "guild" or "user", whether the data object to be set is a guild or a user
     * @returns {Promise<object>} - The inserted/updated object, or reject the error if any
     */
    async set(data, type) {
        type = type === "guild" ? "guild" : "user";
        this[type].get(data.id).replace(data, { returnChanges: true }).run(conn)
            .then(result => {
                return result.changes[0].new_val;
            })
            .catch(err => {
                Promise.reject(err);
            });
    }
}

module.exports = DatabaseWrapper;