const Settings = require('../lib/settings');
const SyncScript = require('../scripts/sync');

const blockchainIndexingService = {};

let isRunning = false;

blockchainIndexingService.run = function() {
    try {
        if(isRunning) {
            return;
        }
        SyncScript.runScript();
    } catch (err) {
        console.error(err);
    } finally {
        isRunning = false;
    }
};

process.on('message', msg => {
    if(msg !== 'INIT' || isRunning) {
        return;
    }

    isRunning = true;   
    blockchainIndexingService.run();

    const updateTimeout = Settings.update_timeout || 125;
    setInterval(blockchainIndexingService.run, updateTimeout);
});

module.exports = blockchainIndexingService;