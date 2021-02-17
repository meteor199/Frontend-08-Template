// 用状态机实现：字符串 “ abcabx ” 的解析

function match(string) {
  let currentState = start;
  let currentIsSecond = false;
  for (let c of string) {
    const { state, isSecond } = currentState(c, currentIsSecond);
    currentState = state;
    currentIsSecond = isSecond;
  }
  return currentState === end;
}

function start(c, isSecond) {
  if (c === "a") {
    return { state: foundA, isSecond: false };
  } else {
    return { state: start, isSecond: false };
  }
}
function end(c, isSecond) {
  return { state: end, isSecond: false };
}

function foundA(c, isSecond) {
  if (c === "b") {
    return { state: foundB, isSecond: isSecond };
  } else {
    return start(c, false);
  }
}
function foundB(c, isSecond) {
  if (c === "c") {
    return { state: foundC, isSecond: false };
  } else if (c === "x" && isSecond) {
    return { state: end, isSecond: isSecond };
  } else {
    return start(c, false);
  }
}

function foundC(c, isSecond) {
  if (c === "a") {
    return { state: foundA, isSecond: true };
  } else {
    return start(c, false);
  }
}
console.log(match("i am abcabxaaa"));
console.log(match("abcabcabx"));
console.log(match("abcabcdabx"));
console.log(match("aaabcabdxx"));
