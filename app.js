const USB_FILENAME = '/dev/ttyUSB0';

const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({
    input: fs.createReadStream(USB_FILENAME),
    output: process.stdout,
    console: false
});

function processLine(line) {
    console.log(line);
}

readInterface.on('line', processLine);
