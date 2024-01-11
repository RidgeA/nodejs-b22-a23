const Koa = require("koa");
const { bodyParser } = require("@koa/bodyparser");
const { pbkdf2 } = require("node:crypto");
const { promisify } = require("node:util");

const userRepo = require("./user/repository");
const { NotFoundError, UniqueConstraintError } = require("./errors/errors");

const pbkdf2Promisify = promisify(pbkdf2);

const app = new Koa();
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e.message)
    switch (true) {
      case e instanceof NotFoundError:
        ctx.throw(404, e.message);
        break;
      case e instanceof UniqueConstraintError:
        ctx.throw(400, e.message);
        break;
      default:
        ctx.throw(500);
        return;
    }
  }
});

app.use(async (ctx) => {
  const { login, password } = ctx.request.body;

  const passwordHash = (await pbkdf2Promisify(password, "salt", 1, 64, "sha512")).toString("hex");

  ctx.body = await userRepo.create({ login, password: passwordHash });
});

app.listen(3000);
