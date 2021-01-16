/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  return kmp(haystack, needle);
};

function kmpTable(pattern) {
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
function kmp(source, pattern) {
  if (pattern === "") {
    return 0;
  }
  let i = 0,
    j = 0;
  const table = kmpTable(pattern);
  while (i < source.length) {
    if (source[i] == pattern[j]) {
      i++;
      j++;
    } else {
      if (j > 0) {
        // 回退
        j = table[j];
      } else {
        ++i;
      }
    }
    if (j === pattern.length) {
      return i - j;
    }
  }

  return -1;
}

// console.log(kmp("abc", "c"));
// console.log(kmp("abcd", "cd"));
console.log(kmp("a", ""));
