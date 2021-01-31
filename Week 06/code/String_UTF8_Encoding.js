function UTF8_Encode(s) {
  const buffer = [];

  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);

    let bit = code.toString(2);
    //
    if (bit.length > 16) {
      // 说明应占4位，总位数 22 位
      bit = bit.padStart(22, 0);
      buffer.push(toBit2("1111" + bit.substring(0, 4))); //1
      buffer.push(toBit2("10" + bit.substring(4, 10))); //2
      buffer.push(toBit2("10" + bit.substring(10, 16))); //3
      buffer.push(toBit2("10 " + bit.substring(16, 22))); //4
    } else if (bit.length > 10) {
      // 说明应占3位，总位数 16 位
      bit = bit.padStart(16, 0);
      buffer.push(toBit2("1110" + bit.substring(0, 4))); //1
      buffer.push(toBit2("10" + bit.substring(4, 10))); //2
      buffer.push(toBit2("10" + bit.substring(10, 16))); //3
    } else {
      // 说明应占2位，总位数 10 位
      bit = bit.padStart(10, 0);
      buffer.push(toBit2("1100" + bit.substring(0, 4))); //1
      buffer.push(toBit2("10" + bit.substring(4, 10))); //2
    }
  }
  return buffer;
}

function toBit2(s) {
  return parseInt(s, 2);
}

console.log(UTF8_Encode("a一"));
