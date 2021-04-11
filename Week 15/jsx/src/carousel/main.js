import { Component, createElement, Div } from "./framework";
import { Carousel } from "./carousel/carousel";
// const a = (
//   <Div id="a">
//     <div>aaa</div>
//     <div>aaa</div>
//     <div>aaa</div>
//   </Div>
// );

const d = [
  "https://static001.geekbang.org/resource/image/bd/47/bdce168820c080adbcbee78b02292f47.jpg",
  "https://static001.geekbang.org/resource/image/1d/6b/1d57a4fde1c266da2e6a8e90808f5b6b.jpg",
  "https://static001.geekbang.org/resource/image/ee/70/ee7627bac9defb7621c2489fbacb3a70.jpg",
  "https://static001.geekbang.org/resource/image/6f/29/6f1f05eade56923b829571ed9ce27329.jpg",
];

const a = <Carousel src={d}></Carousel>;
console.log(a);

a.mountTo(document.body);
