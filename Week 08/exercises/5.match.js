// 不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“abcdef”

function match(str) {
  let currentFound = "a";
  for (let c of str) {
    if (c === currentFound) {
      if (currentFound === "f") {
        return true;
      }
      currentFound = String.fromCharCode(currentFound.charCodeAt(0) + 1);
    } else if (c === "a") {
      currentFound = "b";
    } else {
      currentFound = "a";
    }
  }
  return false;
}
function match1(str) {
  let find = "abcdef";
  let index = 0;

  for (let c of str) {
    if (c === find[index]) {
      if (index === 5) {
        return true;
      }
      index++;
    } else if (c === "a") {
      index = 1;
    } else {
      index = 0;
    }
  }
  return false;
}
