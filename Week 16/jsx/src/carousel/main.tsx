import { Component, createElement } from "./framework";
import { Carousel } from "./carousel";
import { List } from "./list";
import { Button } from "./button";
// const a = (
//   <Div id="a">
//     <div>aaa</div>
//     <div>aaa</div>
//     <div>aaa</div>
//   </Div>
// );
(window as any).createElement = createElement;
const d = [
  {
    img:
      "https://static001.geekbang.org/resource/image/bd/47/bdce168820c080adbcbee78b02292f47.jpg",
    url: "https://time.geekbang.org/",
    title: "a",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/1d/6b/1d57a4fde1c266da2e6a8e90808f5b6b.jpg",
    url: "https://time.geekbang.org/",
    title: "a",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/ee/70/ee7627bac9defb7621c2489fbacb3a70.jpg",
    url: "https://time.geekbang.org/",
    title: "a",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/6f/29/6f1f05eade56923b829571ed9ce27329.jpg",
    url: "https://time.geekbang.org/",
    title: "a",
  },
];

let a = (
  <Carousel
    src={d}
    onChange={(event) => console.log(event.detail.position)}
    onClick={(event) => (window.location.href = event.detail.data.url)}
  />
);

a.mountTo(document.body);

let b = <Button>content</Button>;
b.mountTo(document.body);

let c = (
  <List data={d}>
    {(record) => (
      <div>
        <img src={record.img} />
        <a href={record.url}>{record.title}</a>
      </div>
    )}
  </List>
);

c.mountTo(document.body);
