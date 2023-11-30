
const Router = require("@koa/router");

const { withUserId } = require("./middleware/with-user-id");
const usersDB = require("./users_db")
const auth = require("./auth/auth")

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

    const hash = await auth.hash(password)

    const user = {
      id: usersDB.length,
      name,
      password: hash,
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
