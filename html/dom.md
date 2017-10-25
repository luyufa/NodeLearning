## 文档对象模型(DOM)
> DOM将HTML描绘成一个唯一根结点的层次结构树


#### Node类型

在js中所有的结点都继承自Node类型,

* Document 类型表示整个文档，是一组分层节点的根节点
* Element 节点表示文档中的所有 HTML 或 XML 元素
* 另外还有一些节点类型，分别表示TEXT文本内容、COMMENT注释、文档类型、CDATA 区域和文档片段。


`NodeList`不是数组实例，但提供`forEach`方法进行迭代,`NodeList`是动态对应`DOM`结点

以下代码将会无限循环
```
var i,div,divs = document.getElementsByTagName("div");
for (i=0; i < divs.length; i++){
    div = document.createElement("div");
    document.body.appendChild(div);
}
```


1. 常用的Node操作方法
`appendChild` `insertBefore` `replaceChild` `removeChild`

2. 常用的Node属性
`nodeType` `nodeName` `nodeValue` `firstChild` `lastChild` `childNodes` `parentChild`


#### 查找Dom树种的一个元素的方法
1. 通过id查找
`document.getElementById() ele`

2. 通过class查找
`document.getElementsByClassName() [ele]`

3. 通过标签名字查找`*`会取出全部元素
`document.getElementsByTagName() [ele]`

4. 通过元素中含有name属性的值来查找
`document.getElementsByName()`

5. 所有image `document.images`

6. 所有的带href的a链接 `document.links`

7. `document.querySelector() document.querySelectorAll()`