const log = require(`../util/modules/log`);

module.exports = async(client, err, message) => {
    log.error(`Error: ${err}\nStacktrace: ${err.stack}\nMessage: ${message ? message.content : 'None'}`);
};