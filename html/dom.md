## 文档对象模型(DOM)
> DOM将HTML描绘成一个唯一根结点的层次结构树


#### Node类型

在js中所有的结点都继承自Node类型

`NodeList`不是数组实例，但提供`forEach`方法进行迭代,`NodeList`是动态对应`DOM`结点



1. 常用的Node操作方法
`appendChild` `insertBefore` `replaceChild` `removeChild`

2. 常用的Node属性
`nodeType` `nodeName` `nodeValue` `firstChild` `lastChild` `childNodes` `parentChild`
