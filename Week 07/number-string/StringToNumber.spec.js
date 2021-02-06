import { StringToNumber } from "./StringToNumber";

describe("StringToNumber", () => {
  it("二进制", () => {
    expect(StringToNumber("0b11.1")).toBe(convert("11.1", 2));
    expect(StringToNumber("-0b11.1111")).toBe(convert("-11.1111", 2));
  });
  it("8进制", () => {
    expect(StringToNumber("0o11.1")).toBe(convert("11.1", 8));
    expect(StringToNumber("-0o11.1234")).toBe(convert("-11.1234", 8));
  });
  it("10进制", () => {
    expect(StringToNumber("11.1")).toBe(convert("11.1", 10));
    expect(StringToNumber("-11.1234")).toBe(convert("-11.1234", 10));
  });
  it("16进制", () => {
    expect(StringToNumber("0x11.1")).toBe(convert("11.1", 16));
    expect(StringToNumber("-0x0.AB12")).toBe(convert("-0.AB12", 16));
  });
});

function convert(value, base = 2) {
  var [integer, fraction = ""] = value.toString().split(".");

  return (
    parseInt(integer, base) +
    (integer[0] !== "-" || -1) *
      fraction
        .split("")
        .reduceRight((r, a) => (r + parseInt(a, base)) / base, 0)
  );
}
