const Settings = require('../lib/settings');
const ChildProcess = require('child_process');
const SyncScript = require('../scripts/sync');

const blockchainIndexingService = {};

let isRunning = false;
let childProcess = null;

blockchainIndexingService.run = function() {
    try {
        if(isRunning) {
            return;
        }
        childProcess = ChildProcess.fork(__dirname + '/../scripts/sync.js');
        isRunning = true;
        childProcess.on('exit', msg => {
            console.log('EXITING sync.js process');
            isRunning = false;
        });  
    } catch (err) {
        console.error(err);
    }
};

process.on('message', msg => {
    if(msg !== 'INIT' || isRunning) {
        return;
    }

    blockchainIndexingService.run();

    const updateTimeout = (Settings.update_timeout || 125) * 1000;
    setInterval(blockchainIndexingService.run, updateTimeout);
});

module.exports = blockchainIndexingService;