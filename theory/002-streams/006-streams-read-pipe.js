const {createReadStream, createWriteStream} = require('node:fs');
const path = require('node:path');

const FILE_NAME = path.resolve(process.cwd(), './data/3-law.txt111');

const readStream = createReadStream(FILE_NAME);
const writeStream = createWriteStream(`${FILE_NAME}.bak`, {flags: 'wx'});

/* pipe method */

writeStream.on('error', err => {
    console.log(`Write error ${err.message}`);
  });

readStream.on('error', err => {
  console.log(`Read error: ${err.message}`);
  // delete junk file
});

readStream.pipe(writeStream)


readStream.once('close', () => {
  console.log("Stream closed");
});
