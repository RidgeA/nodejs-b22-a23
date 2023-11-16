const {pipeline, finished} = require('node:stream');
const {createReadStream, createWriteStream} = require('node:fs');
const path = require('node:path');
const {CaesarCipherEncode} = require("./cipher/caesar-stream");

const FILE_NAME = path.resolve(process.cwd(), './data/3-law.txt');

const readStream = createReadStream(FILE_NAME);
const writeStream = createWriteStream(`${FILE_NAME}.encoded`);

const encoder = new CaesarCipherEncode(1);

pipeline(
  readStream,
  encoder,
  writeStream,
  err => {
    if (err) {
      console.error(err.message)
    } else {
      console.log("Done!")
    }
  });

const {promisify} = require('node:util');
const pipelinePromise = promisify(pipeline);

pipelinePromise(readStream, encoder, writeStream)
  .then(() => {
    console.log("Done!")
  })
  .catch(err => {
    console.error(err.message)
  });

finished(readStream, err => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('ReadStream finished');
  }
});

finished(encoder, err => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Encoder finished');
  }
});

finished(writeStream, err => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('WriteStream finished');
  }
});
