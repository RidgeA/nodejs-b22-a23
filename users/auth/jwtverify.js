const cfg = require("./../../config");
const { verifyToken, isExpiredError } = require("./jwt");

module.exports = function(ctx, next) {
  const token = ctx.cookies.get(cfg.auth.jwt.cookieName);

  if (!token) {
    ctx.throw(401);
    return;
  }

  try {
    const userId = verifyToken(token);
    ctx.state = {
      ...ctx.state,
      user: {
        id: userId,
      }
    };
  } catch (e) {
    if (isExpiredError(e)) {
      ctx.throw(401, "jwt token expired");
    }
    console.log("JWT verification error: ", e.message);
    ctx.throw(401);
    return;
  }

  return next();
};
