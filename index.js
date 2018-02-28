const config = require('./config');
const log = require('./util/modules/log');
const database = require('rethinkdb');
let databaseConnection;

if (!config.token) {
    log.error('No token is specified in the config, launch aborted');
    process.exit(0);
}

//This part handle the connection to the database and setup the database if its the first run
log.draft('connectingToDb', 'Connecting to the database server..');
(async function() {
    /**
     * TODO: Delegate and wrap the database/table creation to the database wrapper, only keep the meaningful stuff here
     */
    /*await database.connect({ host: config.database.host, port: config.database.port })
        .then(conn => {
            databaseConnection = conn;
            log.endDraft('connectingToDb', `Successfully connected to the database server at ${config.database.host}:${config.database.port}`);
            database.dbList().run(conn, (err, res) => {
                if (err) {
                    log.error(`Failed to get the database list: ${err}`);
                    process.exit(0);
                }
                if (!res.includes('data')) {
                    log.draft('creatingDatabase', 'No database detected, creating the database..');
                    database.dbCreate('data').run(databaseConnection, () => {});
                    databaseConnection.use('data');
                    log.endDraft('creatingDatabase', `Database created`);
                    //The following part create the needed tables if missing, with some try catch as apparently RethinkDB throw errors like in 2001
                    database.tableList(databaseConnection, (tables) => {
                        if (!tables.includes('users') || !tables.includes('guilds')) {
                            try {
                                database.tableCreate('users').run(conn, () => {});
                            } catch (err) {
                                log.error(err);
                            }
                            try {
                                database.tableCreate('guilds').run(conn, () => {});
                            } catch (err) {
                                log.error(err);
                            }
                        }
                    });
                }
            });
        })
        .catch(err => {
            log.endDraft('connectingToDb', `Failed to connect to the database at ${config.database.host}:${config.database.port}: ${err}`, false);
            process.exit(0);
        });
    const Database = new(require('./util/helpers/DatabaseWrapper'));*/
}());