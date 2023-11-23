module.exports = () => {
  return (userId, ctx, next) => {
    const id = Number(userId);

    if (id < 0 || Number.isNaN(id)) {
      ctx.throw(400, "user id should be a number");
      return;
    }

    ctx.state.userId = id;
    return next();
  }
}

