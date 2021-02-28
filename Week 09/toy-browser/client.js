const parser = require("./parser");
const Request = require("./request");

void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: { name: "winter" },
  });

  let response = await request.send();
  const dom = parser.parserHTML(response.body);
  console.log(JSON.stringify(dom, undefined, 4));
})();
