export const PATTERN_SIZE = 15;

export const PATTERN_COLOR = { 1: "white", 2: "black" };
export function getPattern(values) {
  values = values || [];
  const pattern = Array(PATTERN_SIZE * PATTERN_SIZE)
    .fill(0)
    .map(() => 0);
  values.forEach((r) => {
    pattern[r] = 1;
  });
  return pattern;
}

/**
 *
 * @param {*} arr 数组
 * @param {*} min 最小值
 * @param {*} max 最大值
 */
export function minArr(arr, min, max) {
  let start = arr[0] > min ? 0 : arr.indexOf(min);
  let end = arr[arr.length - 1] < max ? arr.length : arr.indexOf(max) + 1;

  return arr.slice(start, end);
}
/*相邻9个中是否有5个和color相同*/
function equalColor(pattern, color, arr, min, max) {
  const arr1 = minArr(arr, min, max);
  let equal = 0;
  for (let i = 0; i < arr1.length; i++) {
    if (pattern[arr1[i]] == color) {
      equal++;
    } else if (equal >= 5) {
      return true;
    } else {
      equal = 0;
    }
  }

  return equal >= 5;
}

export function check(pattern, color, rowIndex, colIndex) {
  const currentIndex = rowIndex * PATTERN_SIZE + colIndex;
  {
    // 横向
    let win = equalColor(
      pattern,
      color,
      // 取相邻9个值的Index
      Array(9)
        .fill(0)
        .map((r, index) => index + currentIndex - 4),
      rowIndex * PATTERN_SIZE,
      (rowIndex + 1) * PATTERN_SIZE - 1
    );
    if (win) {
      return true;
    }
  }
  {
    // 竖向

    let win = equalColor(
      pattern,
      color,
      Array(9)
        .fill(0)
        .map((r, i) => (rowIndex + i - 4) * PATTERN_SIZE + colIndex),
      colIndex,
      PATTERN_SIZE * (PATTERN_SIZE - 1) + colIndex
    );
    if (win) {
      return true;
    }
  }
  {
    // 正斜向
    let win = equalColor(
      pattern,
      color,
      Array(9)
        .fill(0)
        .map((r, i) => (rowIndex + i - 4) * PATTERN_SIZE + colIndex + i - 4),
      // 当前斜向最小值
      colIndex > rowIndex
        ? colIndex - rowIndex
        : (rowIndex - colIndex) * PATTERN_SIZE,
      // 当前斜向最大值
      colIndex >= rowIndex
        ? (PATTERN_SIZE - colIndex + rowIndex) * PATTERN_SIZE - 1
        : PATTERN_SIZE * PATTERN_SIZE - (rowIndex - colIndex) - 1
    );
    if (win) {
      return true;
    }
  }

  {
    // 反斜向
    // 最小值的偏移量
    let minOffset = Math.min(PATTERN_SIZE - 1 - colIndex, rowIndex);
    // 最大值的偏移量
    let maxOffset = Math.min(PATTERN_SIZE - 1 - rowIndex, colIndex);
    let win = equalColor(
      pattern,
      color,
      Array(9)
        .fill(0)
        .map(
          (r, i) => (rowIndex + (i - 4)) * PATTERN_SIZE + colIndex - (i - 4)
        ),
      // 当前斜向最小值
      (rowIndex - minOffset) * PATTERN_SIZE + colIndex + minOffset,
      // 当前斜向最大值
      (rowIndex + maxOffset) * PATTERN_SIZE + colIndex - maxOffset
    );
    if (win) {
      return true;
    }
  }
  return false;
}

export function willWin(pattern, color) {
  for (let i = 0; i < PATTERN_SIZE; i++) {
    for (let j = 0; j < PATTERN_SIZE; j++) {
      if (pattern[i * PATTERN_SIZE + j]) {
        continue;
      }
      let tmp = clone(pattern);
      tmp[i * PATTERN_SIZE + j] = color;
      if (check(tmp, color, i, j)) {
        return [i, j];
      }
    }
  }
  return null;
}

export function clone(pattern) {
  return Object.create(pattern);
}
export function showChange(pattern, i, j) {
  // 只用修改一个元素
  if (i !== undefined) {
    const cell = document.getElementsByClassName("cell")[i * PATTERN_SIZE + j];
    const color = PATTERN_COLOR[pattern[i * PATTERN_SIZE + j]];
    if (color) {
      cell.classList.add("cell-" + color);
    }
    return;
  }
}
export function alertWin(color) {
  setTimeout(() => {
    alert(PATTERN_COLOR[color] + " is winner!");
  });
}

export function bestChoice(pattern, color, maxLevel) {
  let p;
  // 假如要赢，直接返回
  if ((p = willWin(pattern, color))) {
    return {
      point: p,
      result: 1,
    };
  }
  let result = -2;
  let point = null;

  outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i * 3 + j]) {
        continue;
      }
      let tmp = clone(pattern);
      tmp[i * 3 + j] = color;
      // 计算对方的result,确保本方大于对方
      let r = bestChoice(tmp, 3 - color).result;
      if (-r > result) {
        result = -r;
        point = [i, j];
      }
      if (result == 1) {
        break outer;
      }
    }
  }
  return { point, result: point ? result : 0 };
}
