"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function layout(element) {
    if (!element.computedStyle) {
        return;
    }
    var elementStyle = getStyle(element);
    if (elementStyle.display !== "flex") {
        return;
    }
    var items = element.children.filter((e) => e.type === "element");
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    });
    var style = elementStyle;
    // 主轴与交叉轴
    var obj = {
        mainSize: null,
        mainStart: null,
        mainEnd: null,
        mainSign: null,
        mainBase: null,
        crossSize: null,
        crossStart: null,
        crossEnd: null,
        crossSign: null,
        crossBase: null,
    };
    if (style.flexDirection === "row") {
        obj.mainSize = "width";
        obj.mainStart = "left";
        obj.mainEnd = "right";
        obj.mainSign = +1;
        obj.mainBase = 0;
        obj.crossSize = "height";
        obj.crossStart = "top";
        obj.crossEnd = "bottom";
    }
    else if (style.flexDirection === "row-reverse") {
        obj.mainSize = "width";
        obj.mainStart = "right";
        obj.mainEnd = "left";
        obj.mainSign = -1;
        obj.mainBase = style.width;
        obj.crossSize = "height";
        obj.crossStart = "top";
        obj.crossEnd = "bottom";
    }
    else if (style.flexDirection === "column") {
        obj.mainSize = "height";
        obj.mainStart = "top";
        obj.mainEnd = "bottom";
        obj.mainSign = -1;
        obj.mainBase = 0;
        obj.crossSize = "width";
        obj.crossStart = "left";
        obj.crossEnd = "right";
    }
    else if (style.flexDirection === "column-reverse") {
        obj.mainSize = "height";
        obj.mainStart = "bottom";
        obj.mainEnd = "top";
        obj.mainSign = -1;
        obj.mainBase = style.height;
        obj.crossSize = "width";
        obj.crossStart = "left";
        obj.crossEnd = "right";
    }
    if (style.flexWrap === "wrap-reverse") {
        var tmp = obj.crossStart;
        obj.crossStart = obj.crossEnd;
        obj.crossEnd = tmp;
        obj.crossSign = -1;
    }
    else {
        obj.crossBase = 0;
        obj.crossSign = 1;
    }
}
exports.layout = layout;
function setDefauleValue(obj, key, defaultValue) {
    if (!obj[key] || obj[key] === "auto") {
        obj[key] = defaultValue;
    }
}
function getStyle(element) {
    const style = element.style || {};
    for (let prop in element.computedStyle) {
        style[prop] = element.computedStyle[prop].value;
        if (style[prop].toString().match(/px$/)) {
            style[prop] = parseInt(style[prop].toString());
        }
        if (style[prop].toString().match(/^[0-9\.]+$/)) {
            style[prop] = parseInt(style[prop].toString());
        }
    }
    setDefauleValue(style, "width", null);
    setDefauleValue(style, "height", null);
    setDefauleValue(style, "flexDirection", "row");
    setDefauleValue(style, "alignItems", "stretch");
    setDefauleValue(style, "justifyContent", "flex-start");
    setDefauleValue(style, "flexWrap", "nowrap");
    setDefauleValue(style, "alignContent", "stretch");
    return element.style;
}
