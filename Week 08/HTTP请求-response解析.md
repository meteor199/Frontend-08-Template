# 第四步 ResponseParser 总结

- Response 必须分段构造，所以我们要用一个 ResponseParser 来“装配”
- ResponseParser 分段处理 ResponseText,我们用状态机来分析文本的结构

# 第五步 BodyParser 总结

- Response 的 body 可能根据 Content-Type 有不同的结构，因此我们会采用子 Parser 的结构来解决问题
- 以 TrunkedBodyParser 为例，我们同样用状态机来处理 body 的格式

**Transfer-Encoding: chunked**

- node server 默认使用此方式发送 http body。
- [Transfer-Encoding 说明](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Transfer-Encoding)

- chunked: 在每一个分块的开头需要添加当前分块的长度，以十六进制的形式表示，后面紧跟着 '\r\n' ，之后是分块本身，后面也是'\r\n' 。终止块是一个常规的分块，不同之处在于其长度为 0。终止块后面是一个挂载（trailer），由一系列（或者为空）的实体消息首部构成。

如:

```
d //表示接下来的 chunk 有13个字符
 Hello World\n

0 // 长度为0，表示结尾
```
