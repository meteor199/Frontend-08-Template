"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function layout(element) {
    if (!element.computedStyle) {
        return;
    }
    var elementStyle = getStyle(element);
    if (elementStyle.display !== 'flex') {
        return;
    }
    setDefauleValue(elementStyle, 'width', null);
    setDefauleValue(elementStyle, 'height', null);
    setDefauleValue(elementStyle, 'flexDirection', 'row');
    setDefauleValue(elementStyle, 'alignItems', 'stretch');
    setDefauleValue(elementStyle, 'justifyContent', 'flex-start');
    setDefauleValue(elementStyle, 'flexWrap', 'nowrap');
    setDefauleValue(elementStyle, 'alignContent', 'stretch');
    var items = element.children.filter((e) => e.type === 'element');
    items.sort(function (a, b) {
        return (a.style.order || 0) - (b.style.order || 0);
    });
    // 主轴与交叉轴
    var mainAndCross = getMainAndCrossObj(elementStyle);
    var isAutoMainSize = calcIsAutoMainSize(mainAndCross, elementStyle, items);
    console.log(isAutoMainSize);
    var flexLine = { items: [] };
    var flexLines = [flexLine];
    var mainSpace = elementStyle[mainAndCross.mainSize];
    var crossSpace = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStyle = getStyle(item);
        if (itemStyle[mainAndCross.mainSize] === null) {
            itemStyle[mainAndCross.mainSize] = 0;
        }
        if (itemStyle.flex) {
            flexLine.items.push(item);
        }
        else if (elementStyle.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainAndCross.mainSize];
            if (itemStyle[mainAndCross.crossSize] !== null && itemStyle[mainAndCross.crossSize] !== void 0) {
                crossSpace = Math.max(crossSpace, itemStyle[mainAndCross.crossSize]);
            }
            flexLine.items.push(item);
        }
        else {
            if (itemStyle[mainAndCross.mainSize] > elementStyle[mainAndCross.mainSize]) {
                itemStyle[mainAndCross.mainSize] = elementStyle[mainAndCross.mainSize];
            }
            if (mainSpace < itemStyle[mainAndCross.mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = { items: [item] };
                flexLines.push(flexLine);
                mainSpace = elementStyle[mainAndCross.mainSize];
                crossSpace = 0;
            }
            else {
                flexLine.items.push(item);
            }
            if (itemStyle[mainAndCross.crossSize] !== null && itemStyle[mainAndCross.crossSize] !== void 0) {
                crossSpace = Math.max(crossSpace, itemStyle[mainAndCross.crossSize]);
            }
            mainSpace -= itemStyle[mainAndCross.mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;
    if (elementStyle.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace =
            elementStyle[mainAndCross.crossSize] !== undefined ? elementStyle[mainAndCross.crossSize] : crossSpace;
    }
    else {
        flexLine.crossSpace = crossSpace;
    }
    if (mainSpace < 0) {
        let scale = elementStyle[mainAndCross.mainSize] / (elementStyle[mainAndCross.mainSize] - mainSpace);
        let currentMain = mainAndCross.mainBase;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle.flex) {
                itemStyle[mainAndCross.mainSize] = 0;
            }
            itemStyle[mainAndCross.mainSize] = itemStyle[mainAndCross.mainSize] * scale;
            itemStyle[mainAndCross.mainStart] = currentMain;
            itemStyle[mainAndCross.mainEnd] =
                itemStyle[mainAndCross.mainStart] + mainAndCross.mainSign * itemStyle[mainAndCross.mainSize];
        }
    }
    else {
        flexLines.forEach((items) => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.items.length; i++) {
                const item = items.items[i];
                let itemStyle = getStyle(item);
                if (itemStyle.flex !== null && itemStyle.flex !== undefined) {
                    flexTotal += parseInt(itemStyle.flex + '');
                    continue;
                }
            }
            if (flexTotal > 0) {
                let currentMain = mainAndCross.mainBase;
                for (let i = 0; i < items.items.length; i++) {
                    const item = items.items[i];
                    let itemStyle = getStyle(item);
                    if (itemStyle.flex) {
                        itemStyle[mainAndCross.mainSize] = mainSpace * (itemStyle.flex / flexTotal);
                    }
                    itemStyle[mainAndCross.mainStart] = currentMain;
                    itemStyle[mainAndCross.mainEnd] =
                        itemStyle[mainAndCross.mainStart] + mainAndCross.mainSign * itemStyle[mainAndCross.mainSize];
                    currentMain = itemStyle[mainAndCross.mainEnd];
                }
            }
            else {
                let currentMain, step;
                if (elementStyle.justifyContent === 'flex-start') {
                    currentMain = mainAndCross.mainBase;
                    step = 0;
                }
                if (elementStyle.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainAndCross.mainSign + mainAndCross.mainBase;
                    step = 0;
                }
                if (elementStyle.justifyContent === 'center') {
                    currentMain = (mainSpace / 2) * mainAndCross.mainSign + mainAndCross.mainBase;
                    step = 0;
                }
                if (elementStyle.justifyContent === 'space-between') {
                    step = (mainSpace / (items.items.length - 1)) * mainAndCross.mainSign;
                    currentMain = mainAndCross.mainBase;
                }
                if (elementStyle.justifyContent === 'space-around') {
                    step = (mainSpace / items.items.length) * mainAndCross.mainSign;
                    currentMain = step / 2 + mainAndCross.mainBase;
                }
                for (let i = 0; i < items.items.length; i++) {
                    const item = items.items[i];
                    const itemStyle = getStyle(item);
                    itemStyle[mainAndCross.mainStart] = currentMain;
                    itemStyle[mainAndCross.mainEnd] =
                        itemStyle[mainAndCross.mainStart] + mainAndCross.mainSign * itemStyle[mainAndCross.mainSize];
                    currentMain = itemStyle[mainAndCross.mainEnd] + step;
                }
            }
        });
    }
    if (!elementStyle[mainAndCross.crossSize]) {
        crossSpace = 0;
        elementStyle[mainAndCross.crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[mainAndCross.crossSize] = elementStyle[mainAndCross.crossSize] + flexLines[i].crossSpace;
        }
    }
    else {
        crossSpace = elementStyle[mainAndCross.crossSize];
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }
    if (elementStyle.flexWrap === 'wrap-reverse') {
        mainAndCross.crossBase = elementStyle[mainAndCross.crossSize];
    }
    else {
        mainAndCross.crossBase = 0;
    }
    let lineSize = elementStyle[mainAndCross.crossSize] / flexLines.length;
    let step;
    if (elementStyle.alignContent === 'flex-start') {
        mainAndCross.crossBase += 0;
        step = 0;
    }
    if (elementStyle.alignContent === 'flex-end') {
        mainAndCross.crossBase += mainAndCross.crossSign * crossSpace;
        step = 0;
    }
    if (elementStyle.alignContent === 'center') {
        mainAndCross.crossBase += (mainAndCross.crossSign * crossSpace) / 2;
        step = 0;
    }
    if (elementStyle.alignContent === 'space-between') {
        mainAndCross.crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (elementStyle.alignContent === 'space-around') {
        step = crossSpace / flexLines.length;
        mainAndCross.crossBase = (mainAndCross.crossSign * step) / 2;
    }
    if (elementStyle.alignContent === 'stretch') {
        mainAndCross.crossBase += 0;
        step = 0;
    }
    flexLines.forEach((items) => {
        let lineCrossSize = elementStyle.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace;
        for (let i = 0; i < items.items.length; i++) {
            const item = items.items[i];
            const itemStyle = getStyle(item);
            let align = itemStyle.alignSelf || elementStyle.alignItems;
            if (!itemStyle[mainAndCross.crossSize]) {
                itemStyle[mainAndCross.crossSize] = align === 'stretch' ? lineCrossSize : 0;
            }
            if (align === 'flex-start') {
                itemStyle[mainAndCross.crossStart] = mainAndCross.crossBase;
                itemStyle[mainAndCross.crossEnd] =
                    itemStyle[mainAndCross.crossStart] + mainAndCross.crossSign * itemStyle[mainAndCross.crossSize];
            }
            if (align === 'flex-end') {
                itemStyle[mainAndCross.crossEnd] = mainAndCross.crossBase + mainAndCross.crossSign * lineCrossSize;
                itemStyle[mainAndCross.crossStart] =
                    itemStyle[mainAndCross.crossEnd] - mainAndCross.crossSign * itemStyle[mainAndCross.crossSize];
            }
            if (align === 'center') {
                itemStyle[mainAndCross.crossStart] =
                    mainAndCross.crossBase + (mainAndCross.crossSign * (lineCrossSize - itemStyle[mainAndCross.crossSize])) / 2;
                itemStyle[mainAndCross.crossEnd] =
                    itemStyle[mainAndCross.crossStart] + mainAndCross.crossSign * itemStyle[mainAndCross.crossSize];
            }
            if (align === 'stretch') {
                itemStyle[mainAndCross.crossStart] = mainAndCross.crossBase;
                itemStyle[mainAndCross.crossEnd] =
                    itemStyle[mainAndCross.crossStart] +
                        mainAndCross.crossSign *
                            (itemStyle[mainAndCross.crossSize] !== null && itemStyle[mainAndCross.crossSize] !== 0
                                ? itemStyle[mainAndCross.crossSize]
                                : lineCrossSize);
                itemStyle[mainAndCross.crossSize] =
                    mainAndCross.crossSign * (itemStyle[mainAndCross.crossEnd] - itemStyle[mainAndCross.crossStart]);
            }
        }
        mainAndCross.crossBase += mainAndCross.crossSign * (lineCrossSize + step);
    });
    console.log(items);
}
exports.layout = layout;
function calcIsAutoMainSize(obj, elementStyle, items) {
    var isAutoMainSize = false;
    if (!elementStyle[obj.mainSize]) {
        elementStyle[obj.mainSize] = 0;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            const itemStyle = item.style;
            if (itemStyle[obj.mainSize] != null || itemStyle[obj.mainSize] !== void 0) {
                elementStyle[obj.mainSize] = elementStyle[obj.mainSize] + itemStyle[obj.mainSize];
            }
        }
        isAutoMainSize = true;
    }
    return isAutoMainSize;
}
function getMainAndCrossObj(style) {
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
    if (style.flexDirection === 'row') {
        obj.mainSize = 'width';
        obj.mainStart = 'left';
        obj.mainEnd = 'right';
        obj.mainSign = +1;
        obj.mainBase = 0;
        obj.crossSize = 'height';
        obj.crossStart = 'top';
        obj.crossEnd = 'bottom';
    }
    else if (style.flexDirection === 'row-reverse') {
        obj.mainSize = 'width';
        obj.mainStart = 'right';
        obj.mainEnd = 'left';
        obj.mainSign = -1;
        obj.mainBase = style.width;
        obj.crossSize = 'height';
        obj.crossStart = 'top';
        obj.crossEnd = 'bottom';
    }
    else if (style.flexDirection === 'column') {
        obj.mainSize = 'height';
        obj.mainStart = 'top';
        obj.mainEnd = 'bottom';
        obj.mainSign = -1;
        obj.mainBase = 0;
        obj.crossSize = 'width';
        obj.crossStart = 'left';
        obj.crossEnd = 'right';
    }
    else if (style.flexDirection === 'column-reverse') {
        obj.mainSize = 'height';
        obj.mainStart = 'bottom';
        obj.mainEnd = 'top';
        obj.mainSign = -1;
        obj.mainBase = style.height;
        obj.crossSize = 'width';
        obj.crossStart = 'left';
        obj.crossEnd = 'right';
    }
    if (style.flexWrap === 'wrap-reverse') {
        var tmp = obj.crossStart;
        obj.crossStart = obj.crossEnd;
        obj.crossEnd = tmp;
        obj.crossSign = -1;
    }
    else {
        obj.crossBase = 0;
        obj.crossSign = 1;
    }
    return obj;
}
function setDefauleValue(obj, key, defaultValue) {
    if (!obj[key] || obj[key] === 'auto') {
        obj[key] = defaultValue;
    }
}
function getStyle(element) {
    const style = element.style || {};
    element.style = style;
    for (let prop in element.computedStyle) {
        style[prop] = element.computedStyle[prop].value;
        if (style[prop].toString().match(/px$/)) {
            style[prop] = parseInt(style[prop].toString());
        }
        if (style[prop].toString().match(/^[0-9\.]+$/)) {
            style[prop] = parseInt(style[prop].toString());
        }
    }
    return element.style;
}
//# sourceMappingURL=layout.js.map