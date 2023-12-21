/**
 * https://fastify.dev/
 * https://expressjs.com/
 * https://koajs.com/
 * https://npmtrends.com/
 * https://restfulapi.net/
 * https://www.postman.com/
 * https://insomnia.rest/
 * https://www.youtube.com/watch?v=8aGhZQkoFbQ
 * http://latentflip.com/loupe/
 * https://jwt.io/
 * https://www.postgresql.org/docs/14/index.html
 * https://hub.docker.com/_/postgres
 */

const Koa = require("koa");
const Router = require("@koa/router");

const config = require("./config");
const { logger, cors, bodyParser } = require("./middleware");

const user = require("./users");

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());
app.use(logger());

router.use("/auth", user.authRoutes.routes());
router.use("/oauth", user.oauthRoutes.routes());

router
  .use(user.middleware.verifyToken)
  .use("/users", user.routes.routes());

function delaySync(ms) {
  const start = Date.now();
  while (start + ms >= Date.now()) {
  }
}

router.get("/test-blocking", async (ctx) => {
  delaySync(1000);
  ctx.body = "Hello";
});

const { setTimeout } = require("timers/promises");
router.get("/test-non-blocking", async (ctx) => {
  await setTimeout(1000);
  ctx.body = "Hello";
});

app.use(router.middleware());
app.use(router.allowedMethods());

app.listen(config.http.port, () => {
  console.log(`Server started at port ${config.http.port}`);
});

