/**
 * https://fastify.dev/
 * https://expressjs.com/
 * https://koajs.com/
 * https://npmtrends.com/
 */

const Koa = require("koa");
const cors = require("@koa/cors");
const { setTimeout } = require("node:timers/promises");
const Router = require("@koa/router");
const { bodyParser } = require("@koa/bodyparser");

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser({enableTypes:["json", "text"]}));
app.use(async (ctx, next) => {
  const start = performance.now();

  await next();

  const stop = performance.now();
  const executionTime = stop - start;
  console.log(`${ctx.method} ${ctx.path} - ${ctx.status} [${executionTime}ms]`);
});

// "http://localhost:3000/user?name=Name&password=password"
// all|get|post|put|del|delete|patch
router.post("/user", async (ctx, next) => {

/*
  const dataChunks = []
  ctx.req.on("data", (chunk) => {
    dataChunks.push(chunk);
  });

  ctx.req.on("end", () => {
    const buffer = Buffer.concat(dataChunks);
    const bodyString = buffer.toString()
    console.log(bodyString);
  })
*/

/*
  const dataChunks = []
  for await (const chunk of ctx.req) {
    dataChunks.push(chunk);
  }

  const buffer = Buffer.concat(dataChunks);
  const bodyString = buffer.toString()
  const {name, password} = JSON.parse(bodyString)
*/

  const { name, password } = ctx.request.body; // ctx.request.query
  await setTimeout(100);
  ctx.body = {
    name,
    password,
  };
});

app.use(router.middleware());

app.listen(3000);

// POST /user HTTP 1.1
// Content-Type: application/json
// ...
//
// {"name":"John","password":"qwerty"}
