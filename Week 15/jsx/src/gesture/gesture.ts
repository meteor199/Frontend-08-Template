/**触发自定义事件事件 */
export class Dispatcher {
  constructor(public element: Element) {}

  /**触发事件 */
  dispatch(type: string, properties: Object) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}
/**
 * 监听拖动事件
 * - 同时处理mouse和touch事件
 */
export class Listener {
  constructor(element: Element, recognizer: Recognizer) {
    let contexts = new Map<string | number, IContext>();
    let isListeningMouse = false;

    element.addEventListener("mousedown", (event: MouseEvent) => {
      let context = Object.create(null) as IContext;
      /**鼠标中多个按键同时触发的情况 */
      contexts.set("mouse" + (1 << event.button), context);

      recognizer.start(event, context);

      const mousemove = (event: MouseEvent) => {
        let button = 1;
        while (button <= event.buttons) {
          if (button & event.buttons) {
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }
            let context = contexts.get("mouse" + key);
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      };
      const mouseup = (event: MouseEvent) => {
        let context = contexts.get("mouse" + (1 << event.button));
        recognizer.end(event, context);
        contexts.delete("mouse" + (1 << event.button));
        if (event.buttons === 0) {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup);
          isListeningMouse = false;
        }
      };
      if (!isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        isListeningMouse = true;
      }
    });

    // touch event
    element.addEventListener("touchstart", (event: TouchEvent) => {
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });

    element.addEventListener("touchmove", (event: TouchEvent) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });

    element.addEventListener("touchend", (event: TouchEvent) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });

    element.addEventListener("touchcancel", (event: TouchEvent) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    });
  }
}

/**
 * 处理拖动
 */
export class Recognizer {
  constructor(private dispatcher: Dispatcher) {}

  /** */
  start(point: IPoint, context: IContext) {
    context.startX = point.clientX;
    context.startY = point.clientY;

    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ];

    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
      this.dispatcher.dispatch("press", {});
    }, 500);
  }

  move(point: IPoint, context: IContext) {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      (context.isVertical = Math.abs(dx) < Math.abs(dy)),
        this.dispatcher.dispatch("panstart", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
        });
      clearTimeout(context.handler);
    }

    if (context.isPan) {
      this.dispatcher.dispatch("pan", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }

    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    );

    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    });
  }

  end(point, context) {
    if (context.isTap) {
      clearTimeout(context.handler);
      this.dispatcher.dispatch("tap", {});
    }
    if (context.isPress) {
      this.dispatcher.dispatch("pressend", {});
    }
    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    );
    // 计算速度
    let v;
    if (!context.points.length) {
      v = 0;
    } else {
      let d = Math.sqrt(
        (point.clientX - context.points[0].x) ** 2 +
          (point.clientY - context.points[0].y) ** 2
      );
      v = d / (Date.now() - context.points[0].t);
    }

    if (v > 1.5) {
      context.isFlick = true;
      this.dispatcher.dispatch("flick", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch("panend", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      });
    }
  }

  cancel(point, context) {
    this.dispatcher.dispatch("cancel", {});
    clearTimeout(context.handler);
  }
}

interface IPoint {
  clientX: number;
  clientY: number;
}
interface IContext {
  startX: number;
  startY: number;
  points: { t: number; x: number; y: number }[];
  isTap: boolean;
  isPan: boolean;
  isPress: boolean;
  handler: NodeJS.Timeout;
  isVertical: boolean;
}

export function enableGesture(element: Element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}
