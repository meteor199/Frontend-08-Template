学习笔记

为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？（提交至 GitHub）

`float` 会改变布局，假如 `first-line` 支持 float，当设置 float 时，`first-line`的内容可能会出现改变，会造成无法计算 `first-line`的最终内容。
而 `first-letter` 一定是第一个字符，不会随布局的改变而改变。
