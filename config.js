require("dotenv").config();

module.exports = {
  http: {
    port: process.env.PORT || 3000,
  },
  auth: {
    salt: "salt",
    iterations: 100_000,
    length: 64,
    algo: "sha512",
    secret: "secret",
    session: {
      key: "koa.sess",
      maxAge: 86400000,
      httpOnly: true,
      signed: true,
      secure: false,
      rolling: true,
    },
    jwt: {
      cookieName: "auth",
      secret: "secret",
      algo: "HS512",
      ttl: "5m",
      cookieOptions: {
        httpOnly: true,
      },
      refreshTokenCookieName: "refresh",
      refreshTokenTTL: "1d",
    },
    oauth: {
      github: {
        url: "https://github.com/login/oauth/authorize",
        redirectUri: "http://localhost:3000/oauth/github/callback",
        tokenUrl: "https://github.com/login/oauth/access_token",
        clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
        secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        scopes: "user:email"
      }
    }
  }
};
