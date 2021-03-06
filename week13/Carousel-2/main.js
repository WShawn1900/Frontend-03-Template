import { Component, createElement } from './framework';

class Carousel extends Component {
    constructor(){
        super();
        // 存储属性
        this.attributes = Object.create(null);
    }
    // 重写拿到属性值
    setAttribute(name, value){
        this.attributes[name] = value;
    }
    render(){
        console.log(this.attributes.src);
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        for (let record of this.attributes.src) {
            // 通过 div backgroundImage 防止拖拽
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }
        // 自动播放
        /* 
        // 每个 3 秒移动位置，并修改动画
        let currentIndex = 0;
        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length; // 取余循环轮播
            // 取出前后两张
            let current = children[currentIndex];
            let next = children[nextIndex];

            // 修改下一张位置
            next.style.transition = "none"; //关闭动画
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

            setTimeout(() => { // 延时一帧防止覆盖
                next.style.transition = ""; // 让 css 动画生效
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`;

                // 交换当前位置
                currentIndex = nextIndex;
            }, 16);


            for (let child of children) {
                child.style.transform = `translateX(-${100* current}%)`;
            }


        }, 3000);
        */

        // down => move => up 按顺序执行一组事件
        this.root.addEventListener('mousedown', event => {
            console.log('mousedown')

            let move = event => {
                console.log('mousemove');
            

            }
            let up = () => {
                console.log('mouseup');
                // 移除监听，保证事件按顺序执行
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);

            }
            
            // document 扩大范围即使在浏览器之外
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        })

        return this.root;
    }
    // 
    mountTo(parent){
        parent.appendChild(this.render())
    }
}
const d = [
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
]
let a  = <Carousel src={d} />
a.mountTo(document.body);

