import { Component, createElement } from './framework.js';
import { Carousel } from './carousel.js';
import { Timeline, Animation } from './animation.js';


const d = [
    {
        img:'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
        url: 'https://www.google.com',

    },
    {
        img:'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
        url: 'https://www.google.com',

    },
    {
        img:'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
        url: 'https://www.google.com',

    },
    {
        img:'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
        url: 'https://www.google.com',

    },
]
let a = <Carousel src={d} 
            onChange={event => console.log(event.detail)}
            onClick={event => window.location.href = event.detail.data.url} />
a.mountTo(document.body);

// 测试时间线
// let tl = new Timeline();
// window.tl = tl;
// window.animation = new Animation({set a(v){ console.log('a',v) } }, "a", 0, 100, 1000, null);
// tl.add(new Animation({set a(v){ console.log('a',v) } }, "a", 0, 100, 1000, null));
// tl.start();
