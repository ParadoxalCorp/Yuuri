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
database.connect({ host: config.database.host, port: config.database.port })
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
                database.dbCreate('data').run(conn, () => {});
                log.endDraft('creatingDatabase', `Database created`);
            }
        });
    })
    .catch(err => {
        log.endDraft('connectingToDb', `Failed to connect to the database at ${config.database.host}:${config.database.port}: ${err}`, false);
        process.exit(0);
    });