## inline和block
>`css`中元素大都分类为`inline`行内元素、`block`块元素，可以通过元素的`display`属性来指定。

#### inline

* 行内元素`display:inline`
* 不会以新一行开始,左侧排列至右侧自动换行
* `width`、`heigth`设置无效,宽高就是内容宽高
* `line-height`设置有效
* 左右`margin`生效，上下`margin`无效
* `padding`有效

常见行内元素
`a` `span` `em` `img` `input` `label` `textarea` `select` `button`


#### block

* 块元素 `dispaly:block`
* 元素总是在新行上开始
* width height margin padding 都可控制
* 缺省宽度为父容器100%，缺省高度为内容高度

常见块元素
`div` `form` `h1-h6` `ul` `li` `ol`



#### block-inline

* 行内块级元素 `display:block-inline`
* 具有行内元素的同行显示
* 具有块级元素的宽高特性