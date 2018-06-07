## css中的百分比

###### height width
> 总是依据**父**元素的准确width和height

```
 .warp {
        width: 100%;
        height: 100%;
        border: 1px solid black;
        background-color: #00a1ea;
    }

    .box {
        width: 100%;
        height: 100%;
        background-color: yellow;
    }
<div class="container">
   <div class="warp">
      <div class="box"></div>
   </div>
</div>
```

* `box`的`height`等于父元素`warp height*100%`，父元素`warp height`等于父元素`container height*100%` ，但因`container height`并未设置故高度失效为默认**缺省值为包裹内容**，故最后`box`的`height`为包裹内容


 * 所以很多时候如果元素是根元素`<html>`，它的包含块是视口`viewport`提供的初始包含块`initial containing block`，初始包含块任何时候都被认为是有高度定义的，且等于视口高度。所以 `<html>`标签的高度定义百分比总是有效的，而如果你希望在<body>里也用高度百分比，就一定要先为<html>定义明确的高度。即
 ```
 html, body{height:100%;}
  ```

 * `box`的`width`与`height`类似，但有一点区别是宽度的**缺省值为父容器的100%**


###### magin padding
> 任意方向都是参照**父**元素的准确**宽度**

###### border-radius
> 参照**自身**准确width和height

```
.circle{
    border-radius:50%;//50px 50px
    width:100px;
    height:100px;
}
```
如图绘制圆形

###### background-position
> 参照放置背景图的区域尺寸-背景图尺寸

######  font-size
> 参照自身的font-size

###### lint-height
> 参照自身的font-size
```
<span style="font-size: 15px;line-height: 200%">
   a
</span>
```

###### 定位用的bottom、left、right、top
>参照是父元素的宽高。left和right是参照包含块的宽度，bottom和top是参照包含块的高度。