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
    // 创建轮播图 DOM
    render(){
        console.log(this.attributes.src);
        this.root = document.createElement('div');
        for (let record of this.attributes.src) {
            let child = document.createElement('img');
            child.src = record;
            this.root.appendChild(child);
        }

        return this.root;
    }
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