import { check, getPattern, minArr, willWin } from "./utils.js";

describe("check", () => {
  it("横向第一行开头", () => {
    const pattern = getPattern([0, 1, 2, 3, 4]);
    expect(check(pattern, 1, 0, 4)).toBe(true);
  });
  it("横向第一行结尾", () => {
    const pattern = getPattern([10, 11, 12, 13, 14]);
    expect(check(pattern, 1, 0, 14)).toBe(true);
  });
  it("横向中间", () => {
    const pattern = getPattern([13, 14, 15, 16, 17, 18]);
    expect(check(pattern, 1, 0, 14)).toBe(false);
  });
  it("横向最后", () => {
    const pattern = getPattern([220, 221, 222, 223, 224]);
    expect(check(pattern, 1, 14, 14)).toBe(true);
  });
  it("竖向第一列", () => {
    const pattern = getPattern([0, 15, 30, 45, 60]);
    expect(check(pattern, 1, 4, 0)).toBe(true);
  });
  it("竖向第一列无", () => {
    const pattern = getPattern([0, 15, 30, 45]);
    expect(check(pattern, 1, 4, 0)).toBe(false);
  });
  it("竖向第三列中间", () => {
    const pattern = getPattern([17, 32, 47, 62, 77]);
    expect(check(pattern, 1, 4, 2)).toBe(true);
  });
  it("竖向第一列最后", () => {
    const pattern = getPattern([165, 180, 195, 210, 225]);
    expect(check(pattern, 1, 13, 0)).toBe(false);
  });
  it("正斜向第一列", () => {
    const pattern = getPattern([0, 16, 32, 48, 64]);
    expect(check(pattern, 1, 4, 4)).toBe(true);
  });
  it("正斜向第一列无", () => {
    const pattern = getPattern([0, 16, 32, 48]);
    expect(check(pattern, 1, 3, 3)).toBe(false);
  });
  it("正斜向最后", () => {
    const pattern = getPattern([13, 29]);
    expect(check(pattern, 1, 1, 14)).toBe(false);
  });
  it("正斜向第三列中间", () => {
    const pattern = getPattern([35, 51, 67, 83, 99, 115]);
    expect(check(pattern, 1, 4, 7)).toBe(true);
  });
  it("正斜向第三列后部-右", () => {
    const pattern = getPattern([130, 146, 162, 178, 194]);
    expect(check(pattern, 1, 12, 14)).toBe(true);
  });
  it("正斜向第三列后部-左", () => {
    const pattern = getPattern([156, 172, 188, 204, 220]);
    expect(check(pattern, 1, 14, 10)).toBe(true);
  });
  it("正斜向第一列最后", () => {
    const pattern = getPattern([160, 176, 192, 208, 224]);
    expect(check(pattern, 1, 13, 13)).toBe(true);
  });

  it("反斜向-左部分", () => {
    const pattern = getPattern([5, 19, 33, 47, 61]);
    expect(check(pattern, 1, 2, 3)).toBe(true);
  });
  it("反斜向-右部分", () => {
    const pattern = getPattern([164, 178, 192, 206, 220]);
    expect(check(pattern, 1, 12, 12)).toBe(true);
  });
  it("反斜向-右部分", () => {
    const pattern = getPattern([164, 178, 192, 206]);
    expect(check(pattern, 1, 12, 12)).toBe(false);
  });
});

describe("minArr", () => {
  it("minArr", () => {
    expect(minArr([1, 2, 3, 4], 0, 5)).toEqual([1, 2, 3, 4]);
    expect(minArr([1, 2, 3, 4, 5, 6, 7], 0, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(minArr([1, 2, 3, 4, 5, 6, 7], 3, 5)).toEqual([3, 4, 5]);
  });
});

describe("willWin", () => {
  it("横向-第一列", () => {
    const pattern = getPattern([0, 1, 2, 3]);
    expect(willWin(pattern, 1)).toEqual([0, 4]);
  });
  it("反斜向-右部分", () => {
    const pattern = getPattern([164, 178, 192, 206]);
    expect(willWin(pattern, 1)).toEqual([14, 10]);
  });
});
