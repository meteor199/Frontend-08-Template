const EOF = Symbol("EOF");

let currentToken: {
  type: string;
  tagName?: string;
  isSelfClosing?: boolean;
  [key: string]: string | boolean | undefined | Symbol;
} | null = null;

let currentAttribute: {
  name: string;
  value: string;
} | null = null;

let currentTextNode: {
  type: string;
  content: string;
} | null = null;

interface DomModel {
  type: "document" | "element" | string;
  tagName?: string;
  attributes?: { name: string; value: string }[];
  children?: DomModel[];
}

let stack: DomModel[] = [
  { type: "document", tagName: "", children: [], attributes: [] },
];
function emit(token: typeof currentToken) {
  let top = stack[stack.length - 1];
  if (token!.type == "startTag") {
    let element: DomModel = {
      type: "element",
      tagName: "",
      children: [],
      attributes: [],
    };
    element.tagName = token!.tagName;
    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes!.push({ name: p, value: token[p]! as string });
      }
    }
    top.children!.push(element);
    // element.parent = top;

    if (!token!.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token!.type === "endTag") {
    if (top.tagName != token!.tagName) {
      throw new Error("Tag start end doesn't matchi !");
    } else {
      stack.pop();
    }
    currentTextNode = null;
  } else if (token!.type === "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children!.push(currentTextNode!);
    }
    currentTextNode.content += token!.content;
  }
}

function data(c: string | Symbol): ReturnType {
  if (c == "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: "EOF" });
    return;
  } else {
    emit({ type: "text", content: c });
    return data;
  }
}
function tagOpen(c: string): ReturnType {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return;
  }
}
function endTagOpen(c: string): ReturnType {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}
function tagName(c: string): ReturnType {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken!.tagName += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}
function beforeAttributeName(c: string): ReturnType {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === ">" || c === "/") {
    return afterAttributeName(c);
  } else if (c === "=") {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };

    return attributeName(c);
  }
}

function afterAttributeName(c: string): ReturnType {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    emit(currentToken);
    return data;
  } else {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}
function attributeName(c: string): ReturnType {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">") {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == '"' || c === "'" || c == "<") {
  } else {
    currentAttribute!.name += c;
    return attributeName;
  }
}
function beforeAttributeValue(c: string): ReturnType {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">") {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuoteAttributeValue;
  } else if (c === ">") {
  } else {
    return UnquotedAttributeValue(c);
  }
}
function doubleQuotedAttributeValue(c: string): ReturnType {
  if (c === '"') {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else {
    currentAttribute!.value += c;
    return doubleQuotedAttributeValue;
  }
}
function afterQuotedAttributeValue(c: string): ReturnType {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute!.value += c;
    return doubleQuotedAttributeValue;
  }
}
function singleQuoteAttributeValue(c: string): ReturnType {
  if (c === "'") {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else {
    currentAttribute!.value += c;
    return singleQuoteAttributeValue;
  }
}
function UnquotedAttributeValue(c: string): ReturnType {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken![currentAttribute!.name] = currentAttribute!.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === "'" || c === '"' || c === "<" || c === "=" || c === "`") {
  } else {
    currentAttribute!.value += c;
    return UnquotedAttributeValue;
  }
}
function selfClosingStartTag(c: string): ReturnType {
  if (c === ">") {
    currentToken!.isSelfClosing = true;
    emit(currentToken);
    return data;
  }
  return selfClosingStartTag;
}
export function parseHTML(html: string) {
  stack = [{ type: "document", tagName: "", children: [] }];

  let state = data;

  for (let c of html) {
    state = state(c) as any;
  }
  state = state(EOF) as any;
  return stack[0];
}

type ReturnType = ((c: string) => ReturnType) | void;
