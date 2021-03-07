"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require('./request');
const images = require("images");
const render_1 = require("./render");
const parser_1 = require("./parser");
void (async function () {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8080',
        path: '/',
        headers: {
            ['X-Foo2']: 'customed',
        },
        body: { name: 'winter' },
    });
    let response = await request.send();
    let dom = parser_1.parseHTML(response.body);
    console.log(JSON.stringify(dom, null, '   '));
    let viewport = images(800, 600);
    render_1.render(viewport, dom);
    viewport.save('./viewport.jpg');
})();
//# sourceMappingURL=client.js.map