import { Component } from "./framework";

export class List extends Component {
  protected template;
  protected children;

  constructor() {
    super();
  }

  render() {
    this.children = this.attributes.data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }

  appendChild(child) {
    this.template = child;
    // render();
  }
}
