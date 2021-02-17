function find(str, f) {
  for (let c of str) {
    if (c === f) {
      return true;
    }
  }
  return false;
}
