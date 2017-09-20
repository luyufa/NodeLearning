## Angular作用域
> Angular应用中作用域是以树结构体现的，根作用域`$rootScope`下挂着每级作用域，每个作用域下挂着方法和变量，供所属视图调用，若未指定所属Controller则挂在$rootScope下


#### 作用域的继承

```
<div ng-controller="OuterCtrl">
    <span>{{a}}</span>
    <div ng-controller="InnerCtrl">
        <span>{{a}}</span>
    </div>
</div>
```
```
function OuterCtrl($scope) {
    $scope.a = 1;
}

function InnerCtrl($scope) {
}

```
当控制器存对应视图存在上下级关系时，它的作用域便产生继承关系：控制器的`$scope`基于原型链实现继承

可以通过`$parent`就是直接上级的作用域`$scope`

#### 作用域与作用域中的值传递

```
<div ng-controller="OuterCtrl">
    <span>{{a}}</span>
    <div ng-controller="InnerCtrl">
        <span>{{a}}</span>
        <button ng-click="a=a+1">a++</button>
    </div>
</div>
```
```
function OuterCtrl($scope) {
    $scope.a = 1;
}

function InnerCtrl($scope) {
}

```

当点击按钮时a变得不一致了，外面的变了，里面的没变。`
inner.a = inner.a + 1` `inner`先在自己的作用域内寻找`a`，并未找到，于是沿着原型链网上寻找，发现上级作用域`outer`中有`a`，于是便拿来使用，加1之后在赋值给自己（`值传递-传递的是具体的值`），所以这样一来`inner`中的`a`变了，而`outer`中的`a`未发生变化；当变量为引用类型时(`值传递-传递的是地址的引用`)，这样变共享一个作用域。

#### 控制器实例别名

```
<div ng-controller='Ctrl as c'>{{c.x}}</div>
function Ctrl(){
   this.x='';
}
```
通过as语法创建一个Ctrl的实例c


#### 谁会创建作用域

`ng-controllr` `ng-repeat` `ng-switch` `ng-if`


```
<div>outer: {{sum2}}</div>
<ul>
    <li ng-repeat="item in arr track by $index">
        {{item}}
        <button ng-click="$parent.sum2=sum2+item">increase</button>
        <div>inner: {{sum2}}</div>
    </li>
</ul>
```
`ng-repeat`会为每个`item`创建新的作用域，每一个`itme`的上级作用域都是该`Controller`，这样使用`$parent`的方式就可以共享一个变量


可以在任意一个作用域A内使用`$scope.$new()`创建一个新作用域B，此时A为B的上级作用域。

#### 作用域上的事件
使用$parent可以做到在上下级作用域中通讯，但是这不是一个好方案，会增加模块间的耦合度，对组件复用不利。

![event](https://github.com/luyufa/NodeLearning/blob/master/angular/event.png)

上图是一个Angular应用，存在两个视图块A和B，它们分别又有两个子视图。这时候，如果子视图A1想要发出一个业务事件，使得B1和B2能够得到通知，过程就会是：

1. 沿着父作用域一路往上到达双方共同的祖先作用域
2. 从祖先作用域一级一级往下进行广播，直到到达需要的地方

即

1. 作用域往上发送事件 `$scope.$emit("someEvent", {});`
2. 作用域往下发送事件 `$scope.$broadcast("someEvent", {});`

此方式事件的发送方也会收到该事件

无论是$emit还是$broadcast发送的事件都可以使用`$scope.$on('someEvent',callback)` 来处理，接收了事件不代表终止事件传递，所以`$emit`发生的事件依旧会往上传递，`$broadcast`发送的事件依旧往下传递。


$emit发出的事件是可以被中止的，$broadcast发出的不可以终止，但是可以被忽略,在实际使用过程中，也应当尽量少使用事件的广播，尤其是从较高的层级进行广播。

`$emit`

```
        $scope.$on('someEvent',function (e) {
            e.stopPropagation()
        })
```


`$broadcast`

```
上级作用域
$scope.$on("someEvent", function(e) {
    e.preventDefault();
});
下级作用域
$scope.$on("someEvent", function(e) {
    if (e.defaultPrevented) {
        return;
    }
});
```

#### 事件总线

通过原型继承模块间耦合度比较高、通过事件分发机制如果层级较多时效率低下，可以考虑专门搞一个负责通讯的机构所有人都想它发消息，它在告诉需要的人。如下图：

![event](https://github.com/luyufa/NodeLearning/blob/master/angular/ng_event_bus.png)

```
app.factory("EventBus", function() {
    var eventMap = {};

    var EventBus = {
        on : function(eventType, handler) {
            //multiple event listener
            if (!eventMap[eventType]) {
                eventMap[eventType] = [];
            }
            eventMap[eventType].push(handler);
        },

        off : function(eventType, handler) {
            for (var i = 0; i < eventMap[eventType].length; i++) {
                if (eventMap[eventType][i] === handler) {
                    eventMap[eventType].splice(i, 1);
                    break;
                }
            }
        },

        fire : function(event) {
            var eventType = event.type;
            if (eventMap && eventMap[eventType]) {
                for (var i = 0; i < eventMap[eventType].length; i++) {
                    eventMap[eventType][i](event);
                }
            }
        }
    };
    return EventBus;
});
```

事件订阅代码：

```
EventBus.on("someEvent", function(event) {
    // 这里处理事件
    var c = event.data.a + event.data.b;
});

```
事件发布

```
EventBus.fire({
    type: "someEvent",
    data: {
        aaa: 1,
        bbb: 2
    }
});

```