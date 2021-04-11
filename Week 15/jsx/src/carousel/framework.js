export class Component {
  constructor(type) {
    // this.root = this.render();
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}
export class ElementWrapper extends Component {
  constructor(type) {
    super(type);
    this.root = document.createElement(type);
  }
}

export class TextWrapper extends Component {
  constructor(type) {
    super(type);
    this.root = document.createTextNode(type);
  }
}

export function createElement(type, attributes, ...children) {
  let element;

  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  for (let child of children) {
    if (typeof child === "string") {
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }
  return element;
}
export class Div extends Component {
  constructor() {
    super();
    this.root = document.createElement("div");
  }
}
