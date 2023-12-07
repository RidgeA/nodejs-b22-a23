module.exports = {
  routes: require("./routes"),
  authRoutes: require("./auth/routes"),
  middleware: {
    verifyToken: require("./auth/jwtverify")
  }
};
