const net = require("net");
/**
 * 请求类,发送http请求并解析返回值
 */
class Request {
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if (this.headers["Content-Type"] === "application/json") {
            // 处理 json
            this.bodyText = JSON.stringify(this.body);
        }
        else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            // 处理 表单数据
            this.bodyText = Object.keys(this.body)
                .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
                .join("&");
        }
        // 计算 content-length
        this.headers["Content-Length"] = this.bodyText.length;
    }
    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            }
            else {
                // 创建一个 TCP 连接
                connection = net.createConnection({ host: this.host, port: this.port }, () => {
                    // http是一个 tcp上的文本协议，所以这里自己拼接文本并发送
                    connection.write(this.toString());
                });
            }
            connection.on("data", (data) => {
                console.log(data.toString());
                // 使用状态机 处理返回值
                parser.receive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            });
            // 处理错误
            connection.on("error", (err) => {
                reject(err);
                connection.end();
            });
        });
    }
    toString() {
        // 拼接http
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
            .map((key) => `${key}: ${this.headers[key]}`)
            .join("\r\n")}\r
\r
${this.bodyText}`;
    }
}
/**
 * 处理 Response
 */
class ResponseParser {
    constructor() {
        /** http 状态栏 */
        this.WAITING_STATUS_LINE = 0;
        /** http 状态栏 结束 */
        this.WAITING_STATUS_LINE_END = 1;
        /** http header 的 name */
        this.WAITING_HEADER_NAME = 2;
        /** http header 中间的空格 */
        this.WAITING_HEADER_SPACE = 3;
        /** http header 的值 */
        this.WAITING_HEADER_VALUE = 4;
        /** http header 当前行结束 */
        this.WAITING_HEADER_LINE_END = 5;
        /** http header 结束 */
        this.WAITING_HEADER_BLOCK_END = 6;
        /** http body 请求体 */
        this.WAITING_BODY = 7;
        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        /** 处理 body  */
        this.bodyParser = null;
    }
    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
        console.log(this);
    }
    /**是否处理结束 */
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join(""),
        };
    }
    receiveChar(char) {
        //
        if (this.current === this.WAITING_STATUS_LINE) {
            // 状态栏，\r时结束
            if (char === "\r") {
                this.current = this.WAITING_STATUS_LINE_END;
            }
            else {
                this.statusLine += char;
            }
        }
        else if (this.current === this.WAITING_STATUS_LINE_END) {
            // 状态栏，\n 时结束,切换到处理 header
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        }
        else if (this.current === this.WAITING_HEADER_NAME) {
            // http 头部 name
            if (char === ":") {
                this.current = this.WAITING_HEADER_SPACE;
            }
            else if (char === "\r") {
                // http header结束
                this.current = this.WAITING_HEADER_BLOCK_END;
                // 根据 Transfer-Encoding 生成一个 bodyParser
                if (this.headers["Transfer-Encoding"] === "chunked") {
                    this.bodyParser = new TrunkedBodyParser();
                }
            }
            else {
                this.headerName += char;
            }
        }
        else if (this.current === this.WAITING_HEADER_SPACE) {
            // http 头 : 后的空格
            if (char === " ") {
                this.current = this.WAITING_HEADER_VALUE;
            }
        }
        else if (this.current === this.WAITING_HEADER_VALUE) {
            // http 头的值，当\r时，当前行结束，重新进入下一行
            if (char === "\r") {
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
                this.current = this.WAITING_HEADER_LINE_END;
            }
            else {
                this.headerValue += char;
            }
        }
        else if (this.current === this.WAITING_HEADER_LINE_END) {
            //http 头 当前行处理结束，处理 \n ,并进入下一行处理
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        }
        else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            //http 头 处理结束，处理 \n ,并进入 body处理
            if (char === "\n") {
                this.current = this.WAITING_BODY;
            }
        }
        else if (this.current === this.WAITING_BODY) {
            // 使用 bodyParser 处理 body
            this.bodyParser.receiveChar(char);
        }
    }
}
/**
 * 处理 chunked 编码的body数据。chunked编码格式如下：

```
d //16进制13.表示接下来的 chunk 有13个字符
 Hello World\n

0 // 长度为0，表示结尾
```

*/
class TrunkedBodyParser {
    constructor() {
        /**读取 当前chunk 的长度 */
        this.WAITING_LENGTH = 0;
        /**读取 当前chunk 的长度--结束 */
        this.WAITING_LENGTH_LINE_END = 1;
        /**读取当前 chunk */
        this.READING_TRUNK = 2;
        /**读取新的一行 */
        this.WAITING_NEW_LINE = 3;
        /**读取新的一行--结束 */
        this.WAITING_NEW_LINE_END = 4;
        /**body 读取结束 */
        this.FINISH = 5;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === "\r") {
                if (this.length === 0) {
                    // length是0，说明所有块都已经读取结束
                    this.isFinished = true;
                    this.current = this.FINISH;
                }
                else {
                    // 长度读取成功
                    this.current = this.WAITING_LENGTH_LINE_END;
                }
            }
            else {
                // 当前块的长度
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        }
        else if (this.current === this.FINISH) {
            // body已经解析结束
        }
        else if (this.current === this.WAITING_LENGTH_LINE_END) {
            // 处理 \n ，并开始处理块
            if (char === "\n") {
                this.current = this.READING_TRUNK;
            }
        }
        else if (this.current === this.READING_TRUNK) {
            // 处理块，当length为0时，说明当前块读取结束，开始读取下一块
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        }
        else if (this.current === this.WAITING_NEW_LINE) {
            // 处理\r，并准备处理\n
            if (char === "\r") {
                this.current = this.WAITING_NEW_LINE_END;
            }
        }
        else if (this.current === this.WAITING_NEW_LINE_END) {
            // 处理\n,并开始读取下一 chunk
            if (char === "\n") {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}
module.exports = Request;
