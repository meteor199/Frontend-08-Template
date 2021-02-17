//不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“ab”

function match(str) {
  for (var i = 0; i < str.length - 1; i++) {
    if (str[i] == "a" && str[i + 1] == "b") {
      return true;
    }
  }
  return false;
}

function match1(str) {
  let foundA = false;
  for (let c of str) {
    if (c == "a") {
      foundA = true;
    } else if (foundA && c == "b") {
      return true;
    } else {
      foundA = false;
    }
  }
  return false;
}
