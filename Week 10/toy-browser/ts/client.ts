const Request = require('./request');
import * as images from 'images';
import { render } from './render';
import { parseHTML } from './parser';

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

  let dom = parseHTML(response.body);

  console.log(JSON.stringify(dom, null, '   '));

  let viewport = images(800, 600);
  render(viewport, dom);
  viewport.save('./viewport.jpg');
})();
