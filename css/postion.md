## position

* #### relative
> 按照给定值在原来位置偏移，并不会影响其他元素布局,不脱离文档流

同时指定`top`和`bottom`，以`top`优先

同时指定`left`和`right`，以`left`优先

```
 .box {
            display: inline-block;
            width: 100px;
            height: 100px;
            background: bisque;
        }

        .box-relative {
            position: relative;
            top: 20px;
            left: 20px;
            background: yellow;
        }
```

```
<div class="box">default</div>
<div class="box box-relative">relative</div>
<div class="box">default</div>
<div class="box">default</div>
```
box-relative相对原来位置偏移了，其余div仍然按照原来的布局，不受影响

![1](https://github.com/luyufa/NodeLearning/blob/master/css/position/1.png)

如 `.box-relative增加{float:right;}`则
![3](https://github.com/luyufa/NodeLearning/blob/master/css/position/3.png)

* #### absolute
> 脱离文档流，不占据空间，相对于最近的父容器定位，如不存在则相对于根容器定位

同时指定`top`和`bottom`，如果`height:auto`则自动计算`height`；如果`height:no auto`则以`top`优先

同时指定`left`和`right`，如果`width:auto`则自动计算`width`；如果`width:no auto`则以`left`优先


[如果元素是`absolute`的，同时包含他的父容器是块元素，那么块是从`padding`开始的](https://stackoverflow.com/questions/17115344/absolute-positioning-ignoring-padding-of-parent)

```
.box {
            display: inline-block;
            width: 100px;
            height: 100px;
            background: bisque;
        }

        .box-absolute {
            position: absolute;
            top: 20px;
            left: 20px;
            background: yellow;
        }
```

```
<div class="box">default</div>
<div class="box box-absolute">relative</div>
<div class="box">default</div>
<div class="box">default</div>
```
box-absolute 依据根元素距top20px，距left20px位置定位，其他元素按照文档流规则布局，未受影响

![2](https://github.com/luyufa/NodeLearning/blob/master/css/position/2.png)


* #### fixed
> 与absolute相似，但其始终相对于浏览器视窗viewport定位


* #### inherit
> 继承父元素position


* #### sticky(粘性定位)
>它的表现类似position:relative和position:fixed的合体，在目标区域在屏幕中可见时，它的行为就像position:relative; 而当页面滚动超出目标区域时，它的表现就像position:fixed，它会固定在目标位置,(left<right)、(top>bottom)

```
 .sticky {
            position: -webkit-sticky;//未纳入规范需要私有前缀
            position: sticky;
            top: 0;
        }
```

以下代码展示了使用fixed模拟sticky
```
        .sticky {
            position: fixed;
            top: 0;
        }
        .header {
            width: 100%;
            background: #F6D565;
            padding: 25px 0;
        }
```

```
<p style="margin-bottom:100px;">Scroll this page.</p>
<div class="header"></div>
<p style="margin-top:500px;">Still there?</p>
<p style="margin-top:500px;">Yep!</p>
<p style="margin-top:500px;">Scroll so hard!</p>
```

```
<script>
        var header = document.querySelector('.header');
        var origOffsetY = header.offsetTop;

        function onScroll(e) {
            console.log(window.scrollY, origOffsetY)
            window.scrollY >= origOffsetY ? header.classList.add('sticky') : header.classList.remove('sticky');
        }

        document.addEventListener('scroll', onScroll);
</script>
```