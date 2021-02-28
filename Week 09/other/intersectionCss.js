(function () {
  function getElementCSS(selector) {
    const ret = {
      className: [],
      id: "",
      tagName: "",
    };
    let token = "";
    let current = "tag";
    for (const c of selector) {
      if (c === "#") {
        emit();
        current = "id";
      } else if (c === ".") {
        emit();
        current = "class";
      } else {
        token += c;
      }
    }
    emit();

    function emit() {
      if (token) {
        switch (current) {
          case "id":
            ret.id = token;
            break;
          case "tag":
            ret.tagName = token;
            break;
          case "class":
            ret.className.push(token);
            break;
        }
      }
      token = "";
    }
    return ret;
  }

  console.log(getElementCSS("div.a#c#d"));
  console.log(getElementCSS(".div.a#c.d"));
})();
