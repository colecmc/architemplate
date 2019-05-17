const fs = require('fs');
const options = require('./options');

function initGenerationProcess() {
    fs.readdir('./', (err, files, other) => {
        console.log({ err, files, other });
    })
}

module.exports = initGenerationProcess;
