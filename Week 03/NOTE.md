# 学习笔记

关键字：

- 语法树
- 语法分析
- 词法
- 语法
- 产生式
- LL 语法分析

## 四则运算

### 词法

- TokenNumber:
  - 1 2 3 4 5 6 7 8 9 0 的组合
- Operator: +、 -、 \*、 / 之一
- Whitespace: `<SP>`
- LineTerminator :`<LR> <CR>`

### LL 语法分析

四则运算的产生式：

```
<Expression>::=
  <AdditiveExpression><EOF>

<AdditiveExpression>::=
	<MultiplicativeExpression>
	|<AdditiveExpression><+><MultiplicativeExpression>
	|<AdditiveExpression><-><MultiplicativeExpression>


<MultiplicativeExpression>::=
	<Number>
	|<MultiplicativeExpression><*><Number>
	|<MultiplicativeExpression></><Number>

# 加法展开
<AdditiveExpression>::=
	<Number>
	|<MultiplicativeExpression><*><Number>
	|<MultiplicativeExpression></><Number>
	|<AdditiveExpression><+><MultiplicativeExpression>
	|<AdditiveExpression><-><MultiplicativeExpression>
```

## 生成 AST 的算法

常见的有 LL,LR 算法:

- LL 算法：从左到右扫描，从左到右规约

## 本课编码过程

使用正则表达式 进行词法分析，然后使用产生式生成最终的 ast
