const config = require('./config');
const log = require('./util/modules/log');

if (!config.token) {
    log.error('No token is specified in the config, launch aborted');
    process.exit(0);
}