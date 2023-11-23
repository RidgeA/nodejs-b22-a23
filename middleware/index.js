const cors = require("@koa/cors");
const { bodyParser } = require("@koa/bodyparser");

module.exports = {
  logger: require("./logger"),
  cors: cors,
  bodyParser: () => bodyParser({ enableTypes: ["json", "text"] }),
};
