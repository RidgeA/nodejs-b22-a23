module.exports = function logger() {
  return async (ctx, next) => {
    const start = performance.now();

    await next();

    const stop = performance.now();
    const executionTime = stop - start;
    console.log(`${ctx.method} ${ctx.path} - ${ctx.status} [${executionTime}ms]`);
  };
}

