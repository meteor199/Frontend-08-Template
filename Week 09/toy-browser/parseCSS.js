const css = require("css");

const rules = [];
module.exports.addCSSRules = function (text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
};
module.exports.computeCSS = function (element, stack) {
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split([" "]).reverse();

    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;

    var j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      var sp = specificity(rule.selectors[0]);
      //   console.log("Element ", element, "matched rule", rule);
      var computedStyle = element.computedStyle;

      for (var declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
  console.log(rules);
  console.log("compute CSS for Element", element);
};

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  // id 选择器
  if (selector.charAt(0) == "#") {
    var attr = element.attributes.find((attr) => attr.name === "id");
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) == ".") {
    // css 选择器
    var attr = element.attributes.find((attr) => attr.name === "class");
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    // 标签选择器
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}
function specificity(selector) {
  var sp = [0, 0, 0, 0];

  var selectorParts = selector.split(" ");

  for (var part of selectorParts) {
    if (part.charAt(0) == "#") {
      sp[1] += 1;
    } else if (part.charAt(0) == ".") {
      sp[2] += 1;
    } else {
      sp[3] += 1;
    }
  }
  return sp;
}
function compare(sp1, sp2) {
  for (var i = 0; i < 3; i++) {
    if (sp1[i] - sp2[i]) {
      return sp1[i] - sp2[i];
    }
  }
  return sp1[3] - sp2[3];
}
