/**
 * 数字转字符串。
 * @param {Number} num
 * @param {Number} radix 支持2,8,10,16进制转换
 */
function NumberToString(num, radix) {
  const prefix =
    {
      2: "0b",
      8: "0o",
      16: "0x",
    }[radix] || "";
  if (num > 0) {
    return prefix + num.toString(radix);
  } else {
    return "-" + prefix + Math.abs(num).toString(radix);
  }
}

export { NumberToString };
