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
    }
  }
};
