import { Component } from "./framework";
import { enableGesture } from "../gesture/gesture";
import { Timeline, Animation } from "../animation/animation";
import { ease } from "../animation/ease";

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url('${record.img}')`;
      this.root.appendChild(child);
    }
    enableGesture(this.root);

    let timeline = new Timeline();
    timeline.start();

    let handler = null;

    let children = this.root.children;

    this.state.position = 0;

    let t = 0;
    let ax = 0;

    this.root.addEventListener("panstart", (event) => {
      console.log("panstart");
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 1500) {
        let progress = (Date.now() - t) / 1500;
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener("pan", (event) => {
      console.log("pan");
      let x = event.clientX - event.startX - ax;
      let current = this.state.position - (x - (x % 500)) / 500;
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = "none";

        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    this.root.addEventListener("end", (event) => {
      console.log("end");
      timeline.reset();
      timeline.start();
      handler = setInterval(nextPitcure, 3000);
      let x = event.clientX - event.startX - ax;
      let current = this.state.position - (x - (x % 500)) / 500;

      let direction = Math.round((x % 500) / 500);

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = "none";
        timeline.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      this.state.position =
        this.state.position - (x - (x % 500)) / 500 - direction;
      this.state.position =
        ((this.state.position % children.length) + children.length) %
        children.length;
      this.triggerEvent("change", { position: this.state.position });
    });

    this.root.addEventListener("tap", (event) => {
      console.log("tap");
      this.triggerEvent("click", {
        data: this.attributes.src[this.state.position],
        position: this.state.position,
      });
    });

    let nextPitcure = () => {
      let children = this.root.children;

      let nextIndex = (this.state.position + 1) % children.length;

      let current = children[this.state.position];
      let next = children[nextIndex];

      t = Date.now();

      // 创建animation
      timeline.add(
        new Animation(
          current.style,
          "transform",
          -this.state.position * 500,
          -500 - this.state.position * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      console.log(-this.state.position * 500, -500 - this.state.position * 500);
      console.log(500 - nextIndex * 500, -nextIndex * 500);
      timeline.add(
        new Animation(
          next.style,
          "transform",
          500 - nextIndex * 500,
          -nextIndex * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      this.state.position = nextIndex;
      this.triggerEvent("change", { position: this.state.position });
    };

    handler = setInterval(nextPitcure, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
