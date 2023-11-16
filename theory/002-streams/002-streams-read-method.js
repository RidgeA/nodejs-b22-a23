const { createReadStream } = require("node:fs");
const path = require("node:path");

const FILE_NAME = path.resolve(process.cwd(), "./data/3-law.txt");

const READ_SIZE = 2 ** 15;

const readStream = createReadStream(FILE_NAME, { highWaterMark: 2 ** 14 }); // 64k - default

/* read method */

let totalSize = 0;

readStream.on("readable", function() {
  let chunk = readStream.read();
  while (null !== chunk) {
    console.log(`Received ${chunk.length} bytes of data.`);
    totalSize += chunk.length;
    chunk = readStream.read();
  }
});

readStream.once("end", () => {
  console.log(`Total size: ${totalSize}`);
});

readStream.once("close", () => {
  console.log("Stream closed");
});


