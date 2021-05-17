let http = require("http");
let https = require("https");
let querystring = require("querystring");
let unzipper = require("unzipper");
var shttps = require("socks5-https-client");
var Agent = require("socks5-https-client/lib/Agent");

function auth(request, response) {
  let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);

  getToken(query.code, function (info) {
    response.write(
      `<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`
    );
    response.end();
  });
}

function getToken(code, callback) {
  console.log("getToken", code);
  let request = https.request(
    {
      hostname: "github.com",
      port: 443,
      method: "POST",
      timeout: 5000,
      socksPort: 10800,

      // agentClass: Agent,
      // agentOptions: {
      //   socksHost: "127.0.0.1",
      //   socksPort: 10800,
      // },
      // proxy: "http://127.0.0.1:10801",
      path: `/login/oauth/access_token?code=${code}\
&client_id=Iv1.d17523a7d70110e8\
&client_secret=bbb5f143703d9d0e4d3d5b29642e0fd23e87f19b`,
    },
    function (response) {
      console.log("getToken response", response);
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", (chunk) => {
        callback(querystring.parse(body));
      });
      response.on("error", (err) => {
        console.error("getToken error", err);
      });
    }
  );
  request.on("error", (err) => {
    console.error(err);
  });
}
function publish(request, response) {
  console.log("publish");
  let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  if (query.token) {
    getUser(query.token, (info) => {
      if (info.login === "meteor199") {
        request.pipe(unzipper.Extract({ path: "../server/public/" }));
        request.on("end", function () {
          response.end("success!");
        });
      }
    });
  }
}

function getUser(token, callback) {
  let request = https.request(
    {
      hostname: "api.github.com",
      path: `/user`,
      port: 443,
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "my-publish-tools",
      },
    },
    function (response) {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("end", () => {
        callback(JSON.parse(body));
      });
    }
  );

  request.end();
}

http
  .createServer(function (request, response) {
    if (request.url.match(/^\/auth\?/)) return auth(request, response);
    if (request.url.match(/^\/publish\?/)) return publish(request, response);
  })
  .listen(8082);
