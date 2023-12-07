const Router = require("@koa/router");

const usersDB = require("./../users_db");
const auth = require("./auth");
const { generateToken, refresh } = require("./jwt");
const cfg = require("./../../config");

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

    const token = generateToken(user.id);

    setAuthCookies(ctx, token);

    ctx.body = user;
    ctx.status = 200;
  })
  .get("/me", (ctx) => {
    ctx.body = { userId: ctx.session.userId };

    ctx.status = 200;
  })
  .post("/refresh", ctx => {
    const refToken = ctx.cookies.get(cfg.auth.jwt.refreshTokenCookieName);

    const token = refresh(refToken);

    setAuthCookies(ctx, token);
    ctx.status = 200;
  });

function setAuthCookies(ctx, token) {
  ctx.cookies.set(cfg.auth.jwt.cookieName, token.auth, cfg.auth.jwt.cookieOptions);
  ctx.cookies.set(cfg.auth.jwt.refreshTokenCookieName, token.refresh, {
    maxAge: token.maxAge,
  });
}

module.exports = router;
