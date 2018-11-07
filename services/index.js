const Settings = require('../lib/settings');
const ChildProcess = require('child_process');

let blockchainIndexingService = null;

const services = {};

services.initialize = function() {

    const { autoUpdateFork } = Settings;

    if(!autoUpdateFork) {
        return;
    }

    console.log('Forking Blockchain Indexing Service...')

    blockchainIndexingService = ChildProcess.fork(__dirname + '/blockchain-indexing-service.js');
    blockchainIndexingService.emit('INIT');   
};


module.exports = services;
