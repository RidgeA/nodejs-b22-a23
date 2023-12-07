const { randomUUID } = require("node:crypto");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const cfg = require("./../../config");

const refreshTokens = {};

function generateToken(userId) {
  const authToken = jwt.sign({
      sub: userId
    },
    cfg.auth.jwt.secret,
    {
      algorithm: cfg.auth.jwt.algo,
      expiresIn: cfg.auth.jwt.ttl,
    });

  const refreshToken = randomUUID();

  const maxAge = ms(cfg.auth.jwt.refreshTokenTTL);

  refreshTokens[refreshToken] = {
    userId: userId,
    expires: Date.now() + maxAge,
  };
  return {
    auth: authToken,
    refresh: refreshToken,
    maxAge,
  };
}

function refresh(refreshToken) {

  const refreshTokenData = refreshTokens[refreshToken];

  if (!refreshTokenData) {
    throw new Error("unknown refresh token");
  }

  const { userId, expires } = refreshTokenData;
  if (Date.now() > expires) {
    throw new Error("refresh token expires");
  }

  return generateToken(userId)
}

function verifyToken(token) {
  const { sub: userId } = jwt.verify(token, cfg.auth.jwt.secret);
  return userId;
}

function isExpiredError(err) {
  return err instanceof jwt.TokenExpiredError;
}


module.exports = {
  generateToken,
  verifyToken,
  refresh,
  isExpiredError,
};
