/**
 * 将字符串转为数字。支持 二进制，八进制，十进制
 * @param {String} str。如 -0o11.1,-0x.AAF等
 */
function StringToNumber(str) {
  const s = str.trim();
  /*是否为负数*/
  let minus = s[0] === "-";
  /* 当前字符串为几进制 */
  let systems = minus ? s[1] + s[2] : s[0] + s[1];
  /* 去除进制标志后的字符串 */
  const realstr = minus ? s.substring(3) : s.substring(2);

  switch (systems) {
    case "0b":
    case "0B": //2进制
      return parseNumber(realstr, 2, minus);
    case "0o":
    case "0O": // 8进制
      return parseNumber(realstr, 8, minus);
    case "0x":
    case "0X":
      return parseNumber(realstr, 16, minus);
    default: {
      //16进制
      const realstr = minus ? s.substring(1) : s;
      return parseNumber(realstr, 10, minus);
    }
  }
}

/**
 *
 * @param {String} s 字符串
 * @param {Number} system 几进制
 * @param {Boolean} minus 是否为负数
 */
function parseNumber(s, system, minus) {
  let ret = 0;
  let float = 0;

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
  // 当前进制支持的字符串
  const systemChars = allChars.slice(0, system);
  for (const c of s) {
    if (c === ".") {
      // 浮点数
      if (float > 0) {
        // 说明是第二个小数点，直接返回
        return minus ? -ret : ret;
      } else {
        // 第一个小数点，则记录一下
        float = 1;
        continue;
      }
    }
    const index = systemChars.indexOf(c.toUpperCase());
    if (index === -1) {
      // 非数字字符，则返回已转换的
      return minus ? -ret : ret;
    }

    if (float > 0) {
      //小数位
      ret += index / system ** float;
      float++;
    } else {
      // 非小数位
      ret *= system;
      ret += index;
    }
  }
  return minus ? -ret : ret;
}

export { StringToNumber };
