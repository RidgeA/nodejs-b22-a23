const cluster = require("node:cluster");
const http = require("node:http");
const numCPUs = require("node:os").availableParallelism();
const process = require("node:process");

const stats = {};

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (message) => {
      stats[message.pid]++;
    });
  }

  cluster.on("fork", (worker) => {
    stats[worker.process.pid] = 0;
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  process.on("SIGINT", () => {
    console.log(JSON.stringify(stats, null, 2));
  });

} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello world ${process.pid} \n`);
    console.log(`request on ${process.pid}`);
    process.send({ pid: process.pid });
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
