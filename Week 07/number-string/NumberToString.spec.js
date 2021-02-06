import { NumberToString } from "./NumberToString.0";
import { NumberToString as NumberToString1 } from "./NumberToString.1";

describe("NumberToString", () => {
  it("2进制", () => {
    expect(NumberToString(11, 2)).toBe((11).toString(2));
    expect(NumberToString(11.2, 2)).toBe((11.2).toString(2));
    // expect(StringToNumber("-0b11.1111")).toBe(convert("-11.1111", 2));
  });
  it("10进制", () => {
    expect(StringToNumber("11.1")).toBe(convert("11.1", 10));
    expect(StringToNumber("-11.1234")).toBe(convert("-11.1234", 10));
  });
  it("16进制", () => {
    expect(NumberToString(0xf1, 2)).toBe((0xf1).toString(2));
  });
});
describe("NumberToString1", () => {
  it("2进制", () => {
    expect(NumberToString1(11, 2)).toBe("0b" + (11).toString(2));
    expect(NumberToString1(11.2, 2)).toBe("0b" + (11.2).toString(2));
    // expect(StringToNumber("-0b11.1111")).toBe(convert("-11.1111", 2));
  });
  it("10进制", () => {
    expect(NumberToString1(11, 10)).toBe("" + (11).toString());
    expect(NumberToString1(11.2, 10)).toBe("" + (11.2).toString());
  });
  it("16进制", () => {
    expect(NumberToString1(11, 16)).toBe("0x" + (11).toString(16));
    expect(NumberToString1(11.2, 16)).toBe("0x" + (11.2).toString(16));
  });
});
