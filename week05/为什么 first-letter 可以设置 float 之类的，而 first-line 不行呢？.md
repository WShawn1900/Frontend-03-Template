
`first-letter`：
    可预期，只有首行第一个字母。

`first-line`：
    第一行影响因素太多（元素宽度、文档宽度、字体大小），导致计算匹配复杂。
    `float`会破坏首行范围的计算。

    设置 float ，会脱离正常流。从而产生新的 first-line.