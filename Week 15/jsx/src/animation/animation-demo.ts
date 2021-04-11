import { Timeline, Animation } from "./animation.js";
import { ease, easeIn, easeOut, easeInOut } from "./ease.js";

let tl = new Timeline();
tl.start();

tl.add(
  new Animation(
    getStyle("#el"),
    "transform",
    0,
    500,
    5000,
    0,
    easeInOut,
    (v) => `translateX(${v}px)`
  )
);

function getStyle(id) {
  return (document.querySelector(id) as any).style;
}

getStyle("#el2").transition = "transform 5s ease-in-out";
getStyle("#el2").transform = "translateX(500px)";
document
  .querySelector("#pause-btn")
  .addEventListener("click", () => tl.pause());
document
  .querySelector("#resume-btn")
  .addEventListener("click", () => tl.resume());
