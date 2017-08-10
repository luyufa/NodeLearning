## 回调地狱Callback Hell


`callback hell` 不仅仅是代码的右移，不仅仅是难于维护

```
//1.everything in my program before now

someAsyncThing(function callback(){
    //2.everything in my program for later
}) ;
```
考虑这段代码做了什么,从根本上把程序分为了两个执行过程

1. 直到现在为止发生的事情
2. 以后会发生的事情

`callback`是由第三方也就是`someAsyncThing `来负责执行，此时会出现一个`信任危机`，即对方会何时是否正确的调用我的`callback`。

举个栗子：
比如你有一个电子商务网站，用户就要完成付款的步骤了，但是在扣费之前有最后一个步骤，它需要通知一个第三方跟踪库。你调用他们API，并且提供一个回调函数。大部分情况下，这不会有什么问题。但是，在这次业务中，有一些你和他们都没有意识到的奇怪的Bug，结果就是第三方库在超时之前五秒的时间内每隔一秒就会调用一次回调函数。猜猜发生了什么？在这个回调里调用了chargeTheCreditCard()。

Oops，消费者被扣了五次钱。为什么？因为你相信第三方库只会调用你的回调一次。


那么问题来啦，`promise`怎么解决这个问题？
当完成`someAsyncThing `后发出一个通知，接受到通知之后再执行`callback`，建立在可靠性基础上。

1. `status`一旦改变则不会在变，不可逆。
2. `status`，外部无法修改，只有promise自身可以修改。
3. 一旦`resolve`或者`reject`，则不能再次调用。


其实地狱回调所面临的最大问题并不是代码缩进、难于维护之类，而是回调函数的`控制转移`，而promise的存在则逆转了这个情况，使我们重新获取了callback的控制权限，但这一切都是要建立在promise的可靠性之上。