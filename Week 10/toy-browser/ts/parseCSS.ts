import * as css from "css";
import { ToyElement } from "./type";

const rules = [];
export function addCSSRules(text: string) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}
export function computeCSS(element: ToyElement, stack) {
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
          computedStyle[declaration.property] = {} as any;
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
}

function match(element: ToyElement, selector: string) {
  if (!selector || !element.attributes) {
    return false;
  }

  const selectorIntersection = getSelectorIntersection(selector);
  var id = element.attributes.find((attr) => attr.name === "id")?.value;
  var classNames = element.attributes.find((attr) => attr.name === "class")
    ?.value;
  if (
    selectorIntersection.tagName &&
    selectorIntersection.tagName !== element.tagName
  ) {
    return false;
  }
  if (selectorIntersection.id && selectorIntersection.id != id) {
    return false;
  }

  if (
    selectorIntersection.className.length &&
    !compareArr(selectorIntersection.className, (classNames || "").split(" "))
  ) {
    return false;
  }

  return true;
}
function specificity(selector: string) {
  var selectorParts = selector.split(" ");
  var sp = [0, 0, 0, 0];
  for (let part of selectorParts) {
    const css = getSelectorIntersection(part);

    if (css.tagName) {
      sp[3] += 1;
    } else if (css.id) {
      sp[1] += 1;
    }
    sp[2] += css.className.length;
  }

  return sp;
}
function compare(sp1: number[], sp2: number[]) {
  for (var i = 0; i < 3; i++) {
    if (sp1[i] - sp2[i]) {
      return sp1[i] - sp2[i];
    }
  }
  return sp1[3] - sp2[3];
}
function getSelectorIntersection(selector: string) {
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

/**arr2包含arr1 */
function compareArr(arr1: string[], arr2: string[]) {
  for (let item1 of arr1) {
    if (!arr2.includes(item1)) {
      return false;
    }
  }
  return true;
}
