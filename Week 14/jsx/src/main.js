import { Component, createElement, Div } from "./framework";

// const a = (
//   <Div id="a">
//     <div>aaa</div>
//     <div>aaa</div>
//     <div>aaa</div>
//   </Div>
// );

class Carousel extends Component {
  constructor(type) {
    super(type);
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    console.log(this.attributes.src);

    // 首先显示出来

    const container = document.createElement("div");
    container.classList.add("carousel");
    this.root = container;

    for (let item of this.attributes.src) {
      const div = document.createElement("div");
      div.style.backgroundImage = `url(${item})`;
      container.append(div);
    }

    let position = 0;
    container.addEventListener("mousedown", (event) => {
      let children = container.children;
      let startX = event.clientX;

      let move = (event) => {
        let x = event.clientX - startX;
        let current = position - (x - (x % 500)) / 500;
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${
            -pos * 500 + offset * 500 + (x % 500)
          }px)`;
        }
      };

      let up = (event) => {
        let x = event.clientX - startX;
        position = position - Math.round(x / 500);

        for (let offset of [
          0,
          -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x)),
        ]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = "";
          children[pos].style.transform = `translateX(${
            -pos * 500 + offset * 500
          }px)`;
        }
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length;
    //   let current = children[currentIndex];
    //   let next = children[nextIndex];

    //   next.style.transition = "none";
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

    //   setTimeout(() => {
    //     next.style.transition = "";
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(${-nextIndex * 100}%)`;

    //     currentIndex = nextIndex;
    //   }, 16);
    // }, 3000);

    return container;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

const d = [
  "https://static001.geekbang.org/resource/image/bd/47/bdce168820c080adbcbee78b02292f47.jpg",
  "https://static001.geekbang.org/resource/image/1d/6b/1d57a4fde1c266da2e6a8e90808f5b6b.jpg",
  "https://static001.geekbang.org/resource/image/ee/70/ee7627bac9defb7621c2489fbacb3a70.jpg",
  "https://static001.geekbang.org/resource/image/6f/29/6f1f05eade56923b829571ed9ce27329.jpg",
];

const a = <Carousel src={d}></Carousel>;
console.log(a);

a.mountTo(document.body);
