import { Component } from "./framework";

export class Button extends Component {
  protected childContainer;
  constructor(type) {
    super();
  }
  render() {
    this.childContainer = <span />;
    this.root = (<div>{this.childContainer}</div>).render();
    return this.root;
  }
  appendChild(child) {
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }
}
