const Router = require("@koa/router");

const usersDB = require("./../users_db");
const auth = require("./auth");

const router = new Router();

router
  .post("/login", async ctx => {
    const { name, password } = ctx.request.body;

    const user = usersDB.find((existingUser) => {
      return existingUser.name === name;
    });

    if (!user) {
      ctx.throw(401);
      return;
    }

    if (!await auth.verifyPassword(user, password)) {
      ctx.throw(401);
    }
    ctx.session.userId = user.id;
    ctx.status = 200;
  })
  .get("/me", (ctx) => {
    ctx.body = { userId: ctx.session.userId };
    ctx.status = 200;
  })
  .get("/counter", ctx => {
    if (!ctx.session.views) {
      ctx.session.views = 1;
    }
    ctx.session.views++;
    ctx.body = { views: ctx.session.views };
  });

module.exports = router;
