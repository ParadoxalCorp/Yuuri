const log = require('../modules/log');
const sleep = require('../modules/sleep');

class DatabaseWrapper {
    /**
     * Wraps the most important methods of RethinkDB and does smart things in the background
     * @param {object} client - The client (or bot) instance
     */
    constructor(client) {
        this.conn = {};
        this.rethink = require("rethinkdb");
        this.guildData = this.rethink.db('data').table('guilds');
        this.userData = this.rethink.db('data').table('users');
        this.client = client;
        this.users = new(require('./Collection'))();
        this.guilds = new(require('./Collection'))();
    }

    /** 
     * Initialize the database wrapper, this will start the automatic progressive caching of the database and dynamically handle disconnections
     * @returns {Promise<void>} - An error will be rejected if something fail when establishing the changes stream
     */
    init() {
        return new Promise(async(resolve, reject) => {
            const guildCursor = await this.guildData.changes({ squash: true, includeInitial: true, includeTypes: true }).run(this.conn).catch(err => reject(err));
            const userCursor = await this.userData.changes({ squash: true, includeInitial: true, includeTypes: true }).run(this.conn).catch(err => reject(err));

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
                for (let reconnected = false; !reconnected; reconnected) {
                    await sleep(15000);
                    await this.connect()
                        .then(() => {
                            reconnected = true;
                            this.client.commands
                                .filter(c => c.conf.requireDB)
                                .forEach(c => c.conf.disabled = false);
                            return log.endDraft('reconnectingToDb', `Successfully reconnected to the database, commands have been enabled back`);
                        })
                        .catch();
                }
            });
        });
    }

    /**
     * Establish a simple connection to a RethinkDB server
     * @param {string} [host=config.database.host] - The host name to connect to
     * @param {number} [port=config.database.port] - The port of the host name to connect to
     * @returns {Promise<object>} - The established connection object
     */
    connect(host = this.client.config.database.host, port = this.client.config.database.port) {
        return new Promise(async(resolve, reject) => {
            this.rethink.connect({ host: host, port: port })
                .then(conn => {
                    this.conn = conn;
                    resolve(conn);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Get a guild database entry
     * @param {string} id - The unique identifier of the guild to get
     * @returns {Promise<object>} - The guild entry object, or null if not in the database
     */
    getGuild(id) {
        return new Promise(async(resolve, reject) => {
            if (this.guilds.has(id)) {
                return this.guilds.get(id);
            }
            this.guildData.get(id).run(this.conn)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                    this.client.emit('error', err);
                });
        });
    }

    /**
     * Get a user database entry
     * @param {string} id - The unique identifier of the user to get
     * @returns {Promise<object>} - The user entry object, or null if not in the database
     */
    getUser(id) {
        return new Promise(async(resolve, reject) => {
            if (this.users.has(id)) {
                return this.users.get(id);
            }
            this.userData.get(id).run(this.conn)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                    this.client.emit('error', err);
                });
        });
    }

    /**
     * Insert or update a user/guild in the database
     * @param {object} data - The data object to update/insert in the database 
     * @param {string} type - Can be "guild" or "user", whether the data object to be set is a guild or a user
     * @returns {Promise<object>} - The inserted/updated object, or reject the error if any
     */
    set(data, type) {
        return new Promise(async(resolve, reject) => {
            type = type === "guild" ? "guild" : "user";
            this[type].get(data.id).replace(data, { returnChanges: true }).run(this.conn)
                .then(result => {
                    resolve(result.changes[0].new_val);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Create a new database
     * @param {string} name - The name of the database to create, if there is already a database with this name, the promise will be resolved and nothing will change
     * @returns {Promise<boolean>} - true if success, otherwise, the error is rejected
     */
    createDatabase(name) {
        return new Promise(async(resolve, reject) => {
            const databaseList = await this.rethink.dbList().run(this.conn).catch(err => Promise.reject(new Error(err)));
            if (databaseList.includes(name)) {
                resolve(`There is already an existing database with the name ${name}`);
            }
            this.rethink.dbCreate(name).run(this.conn)
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    reject(new Error(err));
                });
        });
    }

    /**
     * Create a new table in the specified database
     * @param {string} name - The name of the table to create, if there is already a table with this name, the promise will be resolved and nothing will change
     * @param {string} databaseName - The name of the database to create the table in
     * @returns {Promise<boolean>} - true if success, otherwise, the error is rejected
     */
    createTable(name, databaseName) {
        return new Promise(async(resolve, reject) => {
            const tableList = await this.rethink.db(databaseName).tableList().run(this.conn).catch(err => Promise.reject(new Error(err)));
            if (tableList.includes(name)) {
                resolve(`There is already a table with the name ${name} in the database ${databaseName}`);
            }
            this.rethink.db(databaseName).tableCreate(name).run(this.conn)
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    reject(new Error(err));
                });
        });
    }


}

module.exports = DatabaseWrapper;