const {Readable, Writable, Duplex, Transform} = require('stream');

const {createReadStream} = require('fs');

const readable = createReadStream(__filename);


const {Server} = require('net');

const server = new Server();

server.on('connection', socket => {
  console.log('connected');

  socket.on('data', data => {
    console.log('data');
    socket.write(data.reverse());
  })
});

server.listen(8888);
