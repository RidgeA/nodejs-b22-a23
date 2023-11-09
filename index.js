/**
 * https://fastify.dev/
 * https://expressjs.com/
 * https://koajs.com/
 * https://npmtrends.com/
 * https://restfulapi.net/
 * https://www.postman.com/
 * https://insomnia.rest/
 */

const Koa = require("koa");
const cors = require("@koa/cors");
const { setTimeout } = require("node:timers/promises");
const Router = require("@koa/router");
const { bodyParser } = require("@koa/bodyparser");
const { pbkdf2 } = require("node:crypto");
const { promisify } = require("node:util");
const pbkdf2Promise = promisify(pbkdf2);

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser({ enableTypes: ["json", "text"] }));
app.use(async (ctx, next) => {
  const start = performance.now();

  await next();

  const stop = performance.now();
  const executionTime = stop - start;
  console.log(`${ctx.method} ${ctx.path} - ${ctx.status} [${executionTime}ms]`);
});

const usersDB = [];

function withUserId(userId, ctx, next) {
  const id = Number(userId);

  if (id < 0 || Number.isNaN(id)) {
    ctx.throw(400, "user id should be a number");
    return;
  }

  if (id >= usersDB.length) {
    ctx.throw(404, `user with id "${id}" not found`);
    return;
  }

  ctx.state.userId = id;
  return next();
}

// "http://localhost:3000/user?name=Name&password=password"
// all|get|post|put|del|delete|patch
router.prefix("/users")
  .param("userId", withUserId)
  // get all or subset of users
  // GET http://localhost:3000/users
  .get("/", (ctx, next) => {
    ctx.body = usersDB;
  })
  // get user by id
  // GET /users/1, /users/120c8e6a-9394-428a-9dac-8baa6e210410
  .get("/:userId", (ctx, next) => {
    ctx.body = usersDB[Number(ctx.state.userId)];
  })
  // create user
  // POST /users
  .post("/", async (ctx) => {
    const { name, password } = ctx.request.body;

    const hash = await pbkdf2Promise(password, "salt", 100_000, 64, "sha512");

    const user = {
      id: usersDB.length,
      name,
      password: hash.toString('hex'),
    };

    usersDB.push(user);

    ctx.body = user;
    ctx.status = 201;
  })
  // full update of user record
  // PUT /users/1
  .put("/:userId", (ctx, next) => {
    const { name, password } = ctx.request.body;

    const updatedUser = {
      id: ctx.state.userId,
      name,
      password,
    };

    usersDB.splice(ctx.state.userId, 1, updatedUser);

    ctx.body = updatedUser;
  })
  // partial update
  // PATCH /users/1
  .patch("/:userId", (ctx, next) => {
  })
  // delete user record
  // DELETE /users/1
  .delete("/:userId", (ctx, next) => {
  });

// router.post("/users",
//   async (ctx, next) => {
//     const { name, password } = ctx.request.body; // ctx.request.query
//     await setTimeout(100);
//     ctx.body = {
//       name,
//       password,
//     };
//   }
// );

app.use(router.middleware());
app.use(router.allowedMethods());

app.listen(3000);

