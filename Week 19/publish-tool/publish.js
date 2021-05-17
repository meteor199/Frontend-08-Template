const child_process = require("child_process");
const http = require("http");
const querystring = require("querystring");
const archiver = require("archiver");

child_process.exec(
  "start https://github.com/login/oauth/authorize?client_id=Iv1.d17523a7d70110e8"
);

const server = http
  .createServer(function (req, res) {
    // http://localhost:8083/?token=ghu_dJfPI3PWgQ41GvDLcUpFBYCH8o54rl3A2uHB
    let matched = req.url.match(/\?([\s\S]+)$/);
    if (!matched) {
      return res.end();
    }

    let query = querystring.parse(matched[1]);
    console.log(query, matched);
    publish(query.token);
    res.end();
  })
  .listen(8083);

function publish(token) {
  server.close();

  let request = http.request(
    {
      hostname: "127.0.0.1",
      port: 8082,
      method: "post",
      path: `/publish?token=${token}`,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    },
    (response) => {}
  );

  const archive = archiver("zip", {
    zip: { level: 9 },
  });

  archive.directory("./sample/", false);
  archive.finalize();
  archive.pipe(request);
}
