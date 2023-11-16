const {createReadStream} = require('fs');
const path = require('path');

const FILE_NAME = path.resolve(process.cwd(), './data/3-law.txt');

const readStream = createReadStream(FILE_NAME);

/* async iterator */
readStream.once('close', () => {
  console.log("Stream closed");
});

(async function () {

  let totalSize = 0;
  for await (let chunk of readStream) {
    console.log(`Read ${chunk.length} bytes`);
    totalSize += chunk.length;
  }
  console.log(`Total size: ${totalSize}`);

})()
  .catch(error => {
    console.log(error);
  });


// async function* cursor() {
//   const from = 1;
//   const count = 10;
//
//   while (/**/) {
//     yield readFromDb(from, to);
//     from = from + to;
//     to = to + count;
//   }
// }
//
// for await (const data of cursor()) {
//
// }
