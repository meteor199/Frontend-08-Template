//可选作业：我们如何用状态机处理完全未知的 pattern？
//（参考资料：字符串 KMP 算法 https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm）

function match(string, pattern) {
  const state = new MatchState(pattern);

  for (let c of string) {
    state.receiveChar(c);
  }
  return state.isMatch();
}

class MatchState {
  constructor(pattern) {
    this.pattern = pattern;
    // 当前状态，也是当前 pattern 中当前字符的位置
    this.current = 0;
    // 完成状态，当最后一个字符也匹配成功时，说明匹配成功
    this.MATCH_COMPLETE = this.pattern.length;
    // 生成 kmp table
    this.kmpTable = this._generateKmpTable(pattern);
  }
  isMatch() {
    return this.current === this.MATCH_COMPLETE;
  }
  receiveChar(char) {
    if (char === this.pattern[this.current]) {
      // 相等，则进入下一个状态
      this.current++;
    } else if (this.current === this.MATCH_COMPLETE) {
      // 匹配完成，则不做处理
      return;
    } else {
      if (this.current > 0) {
        // 回退
        this.current = this.kmpTable[this.current];
        this.receiveChar(char);
      }
    }
  }
  _generateKmpTable(pattern) {
    const table = Array(pattern.length).fill(0);

    let i = 1,
      j = 0;
    while (i < table.length) {
      if (pattern[i] == pattern[j]) {
        ++i;
        ++j;
        if (i < table.length) {
          table[i] = j;
        }
      } else {
        if (j > 0) {
          // 回退
          j = table[j];
        } else {
          ++i;
        }
      }
    }
    return table;
  }
}

console.log(match("abcdef", "abc"));
console.log(match("abcdef", "adbc"));
console.log(match("abcdef", "abcdef"));
console.log(match("abababababx", "abababx"));
console.log(match("abababababx", "abababx1"));
