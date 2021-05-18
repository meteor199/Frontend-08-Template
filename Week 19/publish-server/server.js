let http = require("http");
let https = require("https");
let request = require("request");

let querystring = require("querystring");
let unzipper = require("unzipper");

function auth(request, response) {
  let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);

  getToken(query.code, function (info) {
    response.write(
      `<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`
    );
    response.end();
  });
}

function requestGithub(url, method, path, headers) {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        url: "https://" + url + path,
        method: method,
        // 假如访问github报错，请开启代理
        // 'proxy':'http://127.0.0.1:10801',
        headers,
      },
      function (error,response,body) {
        if(error){
          reject(error);
          return;
        }
        resolve(body);
      }
    );
    req.end();
  });
}

function requestGithubOld(url, method, path, headers) {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        url: "https://" + url + path,
        method: method,
        // 'proxy':'http://127.0.0.1:10801',
        headers,
      },
      function (error,response,body) {
        if(error){
          reject(error);
          return;
        }
        resolve(body);
      }
    );
    req.end();
  });
}

function getToken(code, callback) {
  requestGithub(
    "github.com",
    "POST",
    `/login/oauth/access_token?code=${code}\
&client_id=Iv1.d17523a7d70110e8\
&client_secret=bbb5f143703d9d0e4d3d5b29642e0fd23e87f19b`
  ).then((body) => {
    callback(querystring.parse(body));
  });
}
function publish(request, response) {
  console.log("publish");
  let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  if (query.token) {
    getUser(query.token, (info) => {
      console.log(info);
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
  requestGithub("api.github.com", "GET", `/user`, {
    Authorization: `token ${token}`,
    "User-Agent": "toy-publish-metor",
  }).then((r) => {
    callback(JSON.parse(r));
  });
}

http
  .createServer(function (request, response) {
    if (request.url.match(/^\/auth\?/)) return auth(request, response);
    if (request.url.match(/^\/publish\?/)) return publish(request, response);
  })
  .listen(8082);
