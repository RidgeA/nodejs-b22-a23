module.exports = {
  routes: require("./routes"),
  authRoutes: require("./auth/routes"),
  oauthRoutes: require("./oauth/routes"),
  middleware: {
    verifyToken: require("./auth/jwtverify")
  }
};
