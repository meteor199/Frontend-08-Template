import { add, mul } from "../src/hello";
import * as assert from "assert";
describe("test hello", () => {
  it("1 + 2 should be 3", () => {
    assert.equal(add(1, 2), 3);
  });
  it("1 * 2 should be 3", () => {
    assert.equal(mul(1, 2), 2);
  });
});
