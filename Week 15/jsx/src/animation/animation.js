export class Timeline {
    constructor() {
        /**当前timeline的状态 */
        this.state = "inited";
        /**animation 集合 */
        this.animationSet = new Set();
        /**记录每个 animation 对应的开始时间 */
        this.startTimeMap = new Map();
        this.pauseTime = 0;
        this.pauseStart = 0;
        this.tickFun = () => { };
        this.tickHandler = 0;
    }
    start() {
        // 当前timeline的状态
        if (this.state !== "inited") {
            return;
        }
        this.state = "started";
        let startTime = Date.now();
        this.pauseTime = 0;
        this.tickFun = () => {
            let now = Date.now();
            for (let animation of this.animationSet) {
                let t;
                if (this.startTimeMap.get(animation) < startTime) {
                    t = now - startTime;
                }
                else {
                    t = now - this.startTimeMap.get(animation);
                }
                // 去除暂停时间以及延迟
                t = t - this.pauseTime - animation.delay;
                if (animation.duration < t) {
                    this.animationSet.delete(animation);
                    t = animation.duration;
                }
                if (t > 0) {
                    animation.receive(t);
                }
            }
            this.tickHandler = requestAnimationFrame(this.tickFun);
        };
        this.tickFun();
    }
    pause() {
        if (this.state !== "started") {
            return;
        }
        this.state = "paused";
        // 记录暂停的时间
        this.pauseStart = Date.now();
        cancelAnimationFrame(this.tickHandler);
    }
    resume() {
        if (this.state !== "paused") {
            return;
        }
        this.state = "started";
        // 重新设置暂停的时间
        this.pauseTime += Date.now() - this.pauseStart;
        this.tickFun();
    }
    reset() {
        this.pause();
        this.state = "inited";
        this.pauseStart = 0;
        this.animationSet = new Set();
        this.startTimeMap = new Map();
        this.pauseStart = 0;
        this.tickHandler = null;
    }
    add(animation, startTime = Date.now()) {
        this.animationSet.add(animation);
        this.startTimeMap.set(animation, startTime);
    }
}
export class Animation {
    constructor(
    /**要设置的对象 */
    object, 
    /**要设置的属性 */
    property, 
    /**开始值 */
    startValue, 
    /**结束值 */
    endValue, 
    /**动画的时长 */
    duration, 
    /**延迟 */
    delay, 
    /**动画的拟合函数 */
    timingFunction = (v) => v, 
    /**设置value时，根据此template设置 */
    template = (v) => v) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template;
    }
    receive(time) {
        let range = this.endValue - this.startValue;
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}
