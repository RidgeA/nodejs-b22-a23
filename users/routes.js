const { pbkdf2 } = require("node:crypto");
const { promisify } = require("node:util");

const Router = require("@koa/router");

const { withUserId } = require("./middleware/with-user-id");

const usersDB = [];
const pbkdf2Promise = promisify(pbkdf2);

const router = new Router();

router
  .param("userId", withUserId)
  .get("/", (ctx, next) => {
    ctx.body = usersDB;
  })
  .get("/:userId", (ctx, next) => {
    ctx.body = usersDB[Number(ctx.state.userId)];
  })
  .post("/", async (ctx) => {
    const { name, password } = ctx.request.body;

    const hash = await pbkdf2Promise(password, "salt", 100_000, 64, "sha512");

    const user = {
      id: usersDB.length,
      name,
      password: hash.toString("hex"),
    };

    usersDB.push(user);

    ctx.body = user;
    ctx.status = 201;
  })
  .put("/:userId", (ctx, next) => {
    const { name, password } = ctx.request.body;

    const updatedUser = {
      id: ctx.state.userId,
      name,
      password,
    };

    usersDB.splice(ctx.state.userId, 1, updatedUser);

    ctx.body = updatedUser;
  });

module.exports = router;
