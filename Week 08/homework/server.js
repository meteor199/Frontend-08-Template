const http = require("http");

http
  .createServer((req, res) => {
    let body = [];
    req
      .on("error", (error) => {
        console.error(error);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        console.log("body:", body);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<html mabc=a>
<head>
<style>
body div #myid{
  width:100px;
  background-color: #ff50000;
}
body div img{
  width:30px;
  background-color: #ff1111;
}
body .btn{
  color:"red"
}
body button.btn{
  color:"blue"
}

</style>
</head>
<body>
        <div>
        <button class="btn btn1">aaa</button>
          <img id="myid"/>
          <img />
        </div>
</body>
</html>`);
      });
  })
  .listen(8088);
console.log("server started");
