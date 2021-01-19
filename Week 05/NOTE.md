学习笔记

# 关键词

- proxy

# reactivy

自己实现一个简单的 vue3 reactive 库

# 拖拽

拖拽时，一般需要在 div 的 mousedown 中监听 document 的 mousemove 和 mouseup 事件:

- 假如在 div 的 mouseup 中进行拖拽，假如移出了这个 div，则拖拽就失效了。
- 在 document 监听，当移出去浏览器范围后，还可以操作。
