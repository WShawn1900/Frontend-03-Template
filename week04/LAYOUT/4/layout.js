/**
 * 排版
 * @param {*} element 已知子元素的标签
 */
function layout(element) {
    if(!element.computedStyle){
        return;
    }

    let elementStyle = getStyle(element);

    if (elementStyle.display !== 'flex') {
        return
    }

    // 拿到标签节点
    let items = element.children.filter(e => e.type === 'element');

    // 支持 order 属性
    items.sort((a, b) => ( a.order || 0) - (b.order || 0) );

    let style = elementStyle;

    // 处理默认值
    ['width', 'height'].forEach(size =>{
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch'; // 伸展
    }
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    // 主轴交叉轴抽象（减少if）预处理flexDirection 和 wrap 
    let mainSize, mainStart, mainEnd, mainSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    if (style.flexDirection === 'row') {
      
        mainSize = 'width'; //主轴宽 
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1; // 延伸方向 +1：向右
        mainBase = 0;  // 延伸生方向开始 0

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') { // 反向 row
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSize = -1;
        mainBase = style.width; // 延伸的开始从主轴末端开始

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainStart = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'wrap-reverse') { // 反向换行
        // 互换交叉轴开始和结束
        let temp = crossStart;
        crossStart = crossEnd;
        crossEnd = temp;
        crossSign = -1;
    }else{
        crossBase = 0;
        crossSign = 1;
    }

    //======================将元素收集进Line=====================

    // 处理没有设置主轴宽度的情况
    let isAutoMainSize = false;
    if(!style[mainSize]){
        elementStyle[mainSize] = 0;
        items.forEach((item)=>{
            const itemStyle = getStyle(item)
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        })
        isAutoMainSize = true;
    }

    console.log('elementStyle',elementStyle);

    let flexLine = [];
    let flexLines = [flexLine]; //至少一行

    let mainSpace = elementStyle[mainSize]; // 主轴空间
    let crossSpace = 0; // 交叉轴空间

    // 遍历子元素
    for(let i = 0; i < items.length ; i++){
        let item = items[i];
        let itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) { //表明子元素是可伸缩的,直接入行
            flexLine.push(item)
        }else if (itemStyle.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize] // 计算主轴剩余空间
            
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                // 计算最高元素（交叉轴最大尺寸），设置为行高
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);

        }else{ // 换行逻辑处理
            if (itemStyle[mainSize] > style[mainSize]) {//子元素尺寸超过主轴宽度，压缩到主轴宽度
                itemStyle[mainSize] = style[mainSize];
            }

            if (mainSpace < itemStyle[mainSize]) {//主轴空间不够,进行换行
                flexLine.mainSpace = mainSpace; // 主轴剩余空间
                flexLine.crossSpace = crossSpace; // 以占用空间
                // 创建新行
                flexLine = [item];
                flexLines.push(flexLine);
                // 重置主轴空间，和交叉轴空间
                mainSpace = style[mainSize];
                crossSpace = 0;
            }else{
                flexLine.push(item);
            }
            // 计算交叉轴属性
            if (itemStyle[crossSize] !== null || itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];

        }        
    }

    flexLine.mainSpace = mainSpace;// 主轴剩余空间


    //===============计算主轴================

    if (style.flexWrap === 'nowrap' || isAutoMainSize) { // 不换行下交叉轴空间
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    }else{
        flexLine.crossSpace = crossSpace;
    }


    if (mainSpace < 0) {
        // 等比缩放 =  主轴  / 容器尺寸 - 主轴空间
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle.flex = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale; // 缩放后尺寸

            itemStyle[mainStart] = currentMain; // left or right 由 mainSign 决定
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]; // width
            currentMain = itemStyle[mainEnd];
        }

    }else{// 处理多行

        flexLines.forEach((items)=>{
            const mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                let itemStyle = getStyle(item);

                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }

            }

            if (flexTotal >0) {// 处理有flex 元素
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    let itemStyle = getStyle(item);

                    if (itemStyle.flex) { //均分
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;  
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }

            }else{ // 处理 justifyContent 

    
                if (style.justifyContent === 'flex-start') {
                    var currentMain = mainBase;
                    var step = 0; // 间隔
                }

                if (style.justifyContent === 'flex-end') {
                    var currentMain = mainSpace * mainSign + mainBase;
                    var step = 0;
                }
                
                if (style.justifyContent === 'center') {
                    var currentMain = mainSpace / 2 * mainSign + mainBase;
                    var setp = 0;
                }

                if (style.justifyContent === 'space-between') {
                    var setp = mainSpace / (items.length -1) * mainSign; // 元素 -1 个间隔
                    var currentMain = mainBase;
                }

                if (style.justifyContent === 'space-around') {
                    var step = mainSpace / items.length * mainSign; 
                    var currentMain = step / 2 + mainBase;
                }

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    let itemStyle = getStyle(item);

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step
                    
                }

            }

        })

    }

    //===============计算交叉轴================
    if (!style[crossSize]) { // 父元素没有高度
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for(let i = 0; i < flexLines.length; i++){
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace; // crossSpace
        }
    }else{
        crossSpace = style[crossSize];
        for(let i = 0; i < flexLines.length; i++){
            crossSpace -= flexLines[i].crossSpace; // crossSpace
        }
    }
    
    if (style.flexWrap === 'wrap-reverse') { // 是否从尾部开始
        crossBase = style[crossSize];
    }else{
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;

    // 依据 align content 分配行高
    let step;
    if (style.alignContent === 'flex-start') {
        crossBase +=0
        step = 0; 
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length -1);
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(items=>{
        // 改行交叉轴尺寸
        let lineCrossSize = style.alignContent === 'stretch' ? 
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;

        // 遍历元素计算交叉轴
        for(let i = 0; i < items.length; i++){
            const item = items[i];
            const itemStyle = getStyle(item);

            // 取决于自身的 alignSelf 和父元素 alignItems
            let align = itemStyle.alignSelf || style.alignItems;

            if (itemStyle[crossSize] === null) { // 没有交叉轴尺寸
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd]   = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : items.crossSpace);

                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }

        }
        crossBase += crossSign * (lineCrossSize + step);
    })

    console.log('flexLines', flexLines);

}

/**
 * 预处理
 * @param {*} element 
 */
function getStyle(element) {
    if (!element.style) {
        element.style = {}
    }

    for (let prop in element.computedStyle) {
        
        // let p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

    }

    return element.style;
    
}

module.exports = layout;