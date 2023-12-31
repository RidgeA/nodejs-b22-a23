const { EventEmitter } = require("node:events");

class MyEmitter extends EventEmitter {
  constructor(str) {
    super();
    if (typeof str !== "string") {
      process.nextTick(() => {
        this.emit("error", new TypeError("First argument must be a string"));
      });
    } else {
      process.nextTick(() => this.emit("start"));
    }
  }
}

const myEE = new MyEmitter(1);

myEE.on("error", err => {
  console.error("Callback error", err.message);
});

