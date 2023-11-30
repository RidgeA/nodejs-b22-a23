const cors = require("@koa/cors");
const { bodyParser } = require("@koa/bodyparser");
const session = require("koa-session");

const config = require("./../config");

module.exports = {
  logger: require("./logger"),
  cors: cors,
  bodyParser: () => bodyParser({ enableTypes: ["json", "text"] }),
  session: (app) => {
    app.keys = [config.auth.secret];
    return session({
      ...config.auth.session,
    }, app);
  }
};
