import assert from "assert";
import { parseHTML } from "../src/parser";
describe("parsehtml", () => {
  it("<a></a>", function () {
    let tree = parseHTML("<a></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<a href="//time.geekbang.org"></a>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org"></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a>a</a>", function () {
    let tree = parseHTML("<a>a</a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 1);
  });
  it("<br/>", function () {
    let tree = parseHTML("<br/>");
    assert.equal(tree.children[0].tagName, "br");
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a id=1 a=2 >a</a>", function () {
    let tree = parseHTML("<a id=1 a=2 >a</a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].attributes[0].value, "1");
    assert.equal(tree.children[0].attributes[1].value, "2");
  });
  it("<input value=a />", function () {
    let tree = parseHTML("<input value=a />");
    assert.equal(tree.children[0].tagName, "input");
    assert.equal(tree.children[0].attributes[0].value, "a");
  });
  it('<a id="1" >a</a>', function () {
    let tree = parseHTML('<a id="1" >a</a>');
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].attributes[0].value, "1");
  });
  it("<a id='1' >a</a>", function () {
    let tree = parseHTML("<a id='1' >a</a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].attributes[0].value, "1");
  });
  it("<a id id1=1 >a</a>", function () {
    let tree = parseHTML("<a id id1=1 >a</a>");
    assert.equal(tree.children[0].attributes[0].name, "id");
    assert.equal(tree.children[0].attributes[1].name, "id1");
  });
  it("<a ></a1>", function () {
    try {
      let tree = parseHTML("<a ></a1>");
      assert.fail("错误");
      console.log(tree);
    } catch (e) {
      // assert.ifError(e);
      console.log(e);
    }
  });
  it("<a></a><a></a>", function () {
    let tree = parseHTML("<a></a><a></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[1].tagName, "a");
  });
});
