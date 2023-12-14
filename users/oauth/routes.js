const { URL } = require("node:url");
const Router = require("@koa/router");
const cfg = require("../../config");

const router = new Router();

const oauthGithub = cfg.auth.oauth.github;

router.get("/github", ctx => {
  const url = new URL(oauthGithub.url);
  url.searchParams.set("client_id", oauthGithub.clientId);
  url.searchParams.set("redirect_uri", oauthGithub.redirectUri);
  url.searchParams.set("scope", oauthGithub.scopes);

  ctx.body = `
  <!doctype html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                           <meta http-equiv="X-UA-Compatible" content="ie=edge">
               <title>Document</title>
  </head>
  <body>
    <h1><a href="${url.toString()}">Login With Github</a></h1>
  </body>
  </html>`;
  ctx.status = 200;
});

// ?code=12345
router.get("/github/callback", async ctx => {

  const response = await fetch(oauthGithub.tokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      client_id: oauthGithub.clientId,
      client_secret: oauthGithub.secret,
      code: ctx.query.code,
    })
  });

  const { access_token: accessToken } = await response.json();

  const user = fetch("https://api.github.com/user", {
    headers: {
      "authorization": `bearer ${accessToken}`,
    }
  }).then(r => r.json());

  const email = fetch("https://api.github.com/user/emails", {
      headers: {
        "authorization": `bearer ${accessToken}`,
        "accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  ).then(r => r.json());


  ctx.body = await Promise.all([user, email]);
})
;

module.exports = router;
