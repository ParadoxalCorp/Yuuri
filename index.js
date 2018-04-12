'use strict';

const config = require('./config');
const { Master: Sharder } = require('eris-sharder');
const axios = require('axios');
const log = require('./util/modules/log');
const r = process.argv.includes('--no-db') ? false : require('rethinkdbdash')({
    servers: [
        { host: config.database.host, port: config.database.port }
    ],
    silent: true,
    log: (message) => {
        log.info(message);
    }
});

const master = new Sharder(config.token, '/main.js', {
    stats: true,
    name: 'Yuuri',
    clientOptions: {
        disableEvents: {
            TYPING_START: true
        },
        messageLimit: 25,
        defaultImageSize: 2048,
    },
    guildsPerShards: 1750,
    debug: true,
    shards: 1,
    clusters: 1
});

master.on('stats', res => {
    if (r) {
        r.db('data').table('stats')
            .insert({ id: 1, stats: res }, { conflict: 'update' })
            .run();
    }

    master.broadcast(1, { type: 'statsUpdate', data: res });
});

if (require('cluster').isMaster) {
    if (r) {
        setInterval(async() => {
            const { stats: { guilds } } = await r.db('data').table('stats')
                .get(1)
                .run();

            for (const botList in config.botLists) {
                if (botList.token) {
                    axios({
                        method: 'post',
                        url: botList.url,
                        data: { server_count: guilds },
                        headers: { 'Authorization': botList.token, 'Content-Type': 'application/json' },
                        timeout: 15000
                    }).then(() => {
                        log.info(`Successfully posted guild stats to ${botList}`);
                    }).catch(err => {
                        log.error(`Failed to post guild stats to ${botList}: ${err}`);
                    });
                }
            }
        }, 3600000);
    }
}