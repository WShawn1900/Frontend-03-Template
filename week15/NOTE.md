# 1. 手势与动画 | 手势的基本知识

>对移动端和桌面端 事件识别进行抽象，消除差异性

* start()
* move()
* end()
* cancel()

## 区分点击、拖拽、移动

* tap 识别距离：一倍屏 5px   二倍屏 10px 三倍屏 15px

```mermaid
graph LR
A[start]
A --> |end| B(Tap)
A --> |移动 10 px| C(pan start) --> |move| D(pan) --> |end| E(pan end)
D --> |end 且速度>?| F(flick 轻扫)
A --> |0.5 s| G(press start) --> |end| H(press end)
G --> |移动 10 px| C
```

# 2. 手势与动画 | 实现鼠标操作

> 在mousedown 内部做 mousemove mouseup 监听，并在 mouseup ,注销 mousemove 和 mouseup 监听

## 监听鼠标点击、移动、抬起

```js
// mouse 系列时间不会在移动端处理
// 鼠标按下监听移动，抬起清空监听
element.addEventListener('mousedown', (event)=> {
    start(event)
    let mousemove = event => {
        console.log(event.clientX, event.clientY)
        move(event)
    }
    let mouseup = event => {
        console.log('mouseup')
        end(event)
        element.removeEventListener('mouseup', mouseup)
        element.removeEventListener('mousemove', mousemove)

    }
    element.addEventListener('mouseup', mouseup)
    element.addEventListener('mousemove', mousemove)
})
```

## 监听移动端设备 touchstart、touchmove、touchend

```js
// 监听移动设备手势
element.addEventListener('touchstart', event => {
    // touch 多个触点
    // identifier :表示每个触控点
    // console.log(event.changedTouches)
    for (let touch of event.changedTouches) {
        start(touch)
    }
})


element.addEventListener('touchmove', event => {
    for (let touch of event.changedTouches) {
        move(touch)
    }
})

element.addEventListener('touchend', event => {
    for (let touch of event.changedTouches) {
        end(touch)
    }
})

// 监听事件被系统取消
element.addEventListener('touchcancel', event => {
    for (let touch of event.changedTouches) {
        cancel(touch)
    }
})
```

## 对移动端和桌面端 事件进行抽象，消除差异性


```js
let start = (point) => {
     console.log('start', point.clientX, point.clientY)


}
let move = (point) => {
     console.log('move', point.clientX, point.clientY)

}
let end = (point) => {
     console.log('end', point.clientX, point.clientY)
}
```

# 4. 手势与动画 | 处理鼠标事件
> 实现对事件的识别

## start 中区分长按事件

```js
let start = (point) => {
    // console.log('start', point.clientX, point.clientY)
    startX = point.clientX, startY = point.clientY 

    isTap = true
    isPan = false
    isPress = false

    handle = setTimeout(() => { // 区分长按事件
        
        isTap = false
        isPan = false
        isPress = true
        handle = null
        console.log("press")
        
    }, 500);

}
```

## move 识别移动

```js
let move = (point) => {
    // console.log('move', point.clientX, point.clientY)
    let dx = point.clientX - startX , dy = point.clientY - startY;

    // 移动 10 px
    if (dx ** 2 + dy ** 2 > 100) {
        isTap = false
        isPan = true
        isPress = false
        // 清空长按识别
        clearTimeout(handle)
    }

    if (isPan) {
        console.log('pan')
    }
}
```

## end 中识别 tap

```js
let end = (point) => {
    // console.log('end', point.clientX, point.clientY)
    console.log(point)

    if (isTap) {
        console.log('tap')
        clearTimeout(handle)
    }

    if (isPan) {
        console.log('paned')
    }

    if (isPress) {
        console.log('pressed')
    }

}
```

# 5. 手势与动画 | 派发事件

## 创建事件派发函数

```js
/**
 * 事件派发
 * @param {*} type 事件类型
 * @param {*} properties 事件携带数据
 */
function dispatch(type, properties){
    let event = new Event(type);
    // 配置事件上的数据
    for (const name in properties) {
        event[name] = properties[name]
    }
    // 派发事件
    element.dispatchEvent(event)
}
```

## 派发一个 tap 事件，并监听

```js
let end = (point, context) => {
    // console.log('end', point.clientX, point.clientY)
    console.log(point)

    // tap 事件
    if (isTap) {
        console.log('tap')
        dispatch('tap',{})
        clearTimeout(context.handle)
    }

    if (isPan) {
        console.log('paned')
    }

    if (isPress) {
        console.log('pressed')
    }

}

// 监听 tap
document.documentElement.addEventListener('tap', () => {
    console.log('tap event trigger')
})
```

# 6. 手势与动画 | 实现一个flick事件

> 关键在于判断速度。（存储一段时间内的点，求平均）


## start() 初始化存入计算所需数据

```js
// 存储用于计算速度的信息
context.points = [
    {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    }
]
```

## move() 存入一段时间内移动数据

```js
// 存入一段时间内移动数据
// 只存储 500 ms 范围内的点
context.points = context.points.filter(point => Date.now() - point.t < 500)
context.points.push({
    t: Date.now(),
    x: point.clientX,
    y: point.clientY
})

```

## end() 计算速度，根据速度得出 flick 事件

```js
//计算 flick 速度
context.points = context.points.filter(point => Date.now() - point.t < 500)
let d,v;
if (!context.points.length) { // 鼠标离开的速度 0 
    v = 0
}else{
    // 移动距离 = 开（x 轴距离平方 + y 轴距离平方）的平方
    d =  Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2)
    // 速度 = 移动距离 / (当前时间 - 第一个移动点的时间)
    v = d / (Date.now() - context.points[0].t)
}

// 1.5 像素每毫秒为 flick
if (v > 1.5) {
    console.log('filck')
    context.isFilck = true
}else{
    context.isFilck = false
}
```

# 7. 手势与动画 | 封装

## 功能模块拆分，实现结耦 
 
* listen：监听
* recognize：识别
* dispatch：派发

` new Listener(element, new Recognizer(new Dispatch(element)))`
## 分装 Listener

```js
/**
 *实现对鼠标和触摸事件统一处理监听
 */
export class Listener {
    /**
     * 构造 Listener
     * @param {*} element 监听元素
     * @param {*} recognizer 识别器 new Recognizer()
     */
    constructor(element, recognizer){

        let isListeningMouse = false;// 处理多键位同时按下，mouseup 重复绑定的问题
        // 全局存储上下文
        let contexts = new Map();

        // mouse 系列时间不会在移动端处理
        // 鼠标按下监听移动，抬起清空监听
        element.addEventListener('mousedown', (event)=> {
        
            let context = Object.create(null)
            // key = mouse + 键位
            // 移位作为 key
            contexts.set('mouse' + (1 << event.button) , context)
        
            recognizer.start(event, context)
            let mousemove = event => {
                let button = 1
                // 匹配对应键位
                // 二进制掩码表示键位
                while (button <= event.buttons) {
                    if(button & event.buttons){ // 只处理鼠标按下
                        // 处理和 event 中键位顺序不一直的问题
                        let key;
                        if(button === 2){
                            key = 4
                        }else if(button === 4){
                            key = 2
                        }else(
                            key = button
                        )
                        let context = contexts.get('mouse' + key)
                        recognizer.move(event, context)
                        button = button << 1
                    }
                }
               
            }
            let mouseup = event => {
                console.log('mouseup')
                contexts.get('mouse' + (1 << event.button))
                recognizer.end(event,context)
                // 移除context
                contexts.delete('mouse' + (1 << event.button))
        
                if (event.buttons === 0) { // 没有键位信息移除监听
                    document.removeEventListener('mouseup', mouseup)
                    document.removeEventListener('mousemove', mousemove)   
                    isListeningMouse = false
                }
        
            }
            if(!isListeningMouse){
                document.addEventListener('mouseup', mouseup)
                document.addEventListener('mousemove', mousemove)
                isListeningMouse = true
            }
        })


        // 监听移动设备手势
        element.addEventListener('touchstart', event => {
            // touch 多个触点 changedTouches
            for (let touch of event.changedTouches) {
                // 创建上下文并存入全局中
                let context = Object.create(null)
                contexts.set(touch.identifier, context)
                recognizer.start(touch, context)
            }
        })


        element.addEventListener('touchmove', event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.move(touch, context)
            }
        })

        element.addEventListener('touchend', event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.end(touch,context)
                contexts.delete(touch.identifier)
            }
        })

        // 监听事件被系统取消
        element.addEventListener('touchcancel', event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.cancel(touch, context)
                contexts.delete(touch.identifier)
            }
        })
    }
    
}
```

## 分装 Recognizer

```js
/**
 * 识别事件类型
 */
export class Recognizer{
    /**
     * 构造 Recognizer
     * @param {*} dispatcher new Dispatcher()
     */
    constructor(dispatcher){
        this.dispatcher = dispatcher;
    }


    start(point, context) {
        // 将手势全局状态转化为参数，方便对状态做更为细致的区分。(鼠标左右键，多个触控点)
        context.startX = point.clientX, context.startY = point.clientY 
    
        // 存储用于计算速度的信息
        context.points = [
            {
                t: Date.now(),
                x: point.clientX,
                y: point.clientY
            }
        ]
    
        context.isTap = true
        context.isPan = false
        context.isPress = false
    
        handle = setTimeout(() => { // 区分长按事件
            
            context.isTap = false
            context.isPan = false
            context.isPress = true
            context.handle = null
            this.dispatcher('press', {})
            
        }, 500);
    
    } 
    
    move(point, context) {
        // console.log('move', point.clientX, point.clientY)
        let dx = point.clientX - startX , dy = point.clientY - startY;
    
        // 移动 10 px
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isTap = false
            context.isPan = true
            context.isPress = false
            this.dispatcher('panstart',{
                startX: context.startX,
                startY: context.startY,
                clientX: context.clientX,
                clientY: context.clientY,
                isVertical: Math.abs(dx) < Math.abs(dy),

            })
            clearTimeout(context.handle)
        }
    
        if (context.isPan) {
            console.log('pan')
            this.dispatcher('pan',{
                startX: context.startX,
                startY: context.startY,
                clientX: context.clientX,
                clientY: context.clientY,
                isVertical: context.isVertical,

            })
        }
    
        // 存入一段时间内移动数据
        // 只存储 500 ms 范围内的点
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
    }

    end(point, context) {
        // console.log('end', point.clientX, point.clientY)
        console.log(point)
    
        // tap 事件
        if (isTap) {
            console.log('tap')
            this.dispatcher('tap',{})
            clearTimeout(context.handle)
        }
    
        // 长按 
        if (isPress) {
            this.dispatcher('pressed', {})
            console.log('pressed')
        }
    
        //计算 flick 速度
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        let d,v;
        if (!context.points.length) { // 鼠标离开的速度 0 
            v = 0
        }else{
            // 移动距离 = 开（x 轴距离平方 + y 轴距离平方）的平方
            d =  Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2)
            // 速度 = 移动距离 / (当前时间 - 第一个移动点的时间)
            v = d / (Date.now() - context.points[0].t)
        }
    
        // 像素每毫秒
        if (v > 1.5) {
            console.log('filck')
            this.dispatcher('filck',{
                startX: context.startX,
                startY: context.startY,
                clientX: context.clientX,
                clientY: context.clientY,
                isVertical: context.isVertical,
                isFilck: context.isFilck,
                velocity: v
            })
            context.isFilck = true
        }else{
            context.isFilck = false
        }

        if (isPan) {
            console.log('paned')
            this.dispatcher('paned',{
                startX: context.startX,
                startY: context.startY,
                clientX: context.clientX,
                clientY: context.clientY,
                isVertical: context.isVertical,
                isFilck: context.isFilck
            })
        }

    
    }

    cancel(point, context) {
        this.dispatcher('cancel', {})
        clearTimeout(context.handle)
        
    }


}
```

## 分装 Dispatcher

```js

/**
 * 派发事件
 */
export class Dispatcher {
    /**
     * 构造 Dispatcher
     * @param {*} element 可监听元素
     */
    constructor(element){
        this.element = element
    }
    /**
     * 事件派发
     * @param {*} type 事件类型
     * @param {*} properties 事件携带数据
     */
    dispatch(type, properties){
        let event = new Event(type);
        // 配置事件上的数据
        for (const name in properties) {
            event[name] = properties[name]
        }
        // 派发事件
        this.element.dispatchEvent(event)
    }
}
```