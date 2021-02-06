/**
 * 数字转字符串。由于小数部分的精度问题，对小数的转换有问题
 * @param {Number} num
 * @param {Number} radix 2-16进制
 */
function NumberToString(num, radix) {
  const positive = Math.abs(num);
  let integer = Math.floor(positive);

  let ret = "";
  const allChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  // 整数位
  while (integer > 0) {
    ret = allChars[integer % radix] + ret;
    integer = Math.floor(integer / radix);
  }
  let fraction = num % 1;

  // 小数位

  if (fraction > 0) {
    let fractionStr = "";

    while (fraction > 0) {
      fraction = fraction * radix;
      fractionStr += allChars[Math.floor(fraction)];
      fraction = fraction % 1;
    }

    if (ret) {
      ret += "." + fraction;
    } else {
      ret = "0." + fraction;
    }
  }

  return num > 0 ? ret : "-" + ret;
}

export { NumberToString };
