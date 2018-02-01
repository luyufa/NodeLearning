## redis设计实现-双端链表
> 链表提供了高效的结点排重能力，以及顺序性访问，灵活的调整链表长度

```
struct listNode{
    listNode *prev 前置结点
    listNode *next 后置结点
    void vlue 结点值
}
```

```
struct list{
    listNode *head 链表头结点
    listNode *tail 链表尾结点
    int len 链表长度
}
```

redis实现的链表特性

 * 双端:链表结点带有prev和next指针，获取前驱或后置结点的复杂度都为O(1)
 * 无环:链表的头结点prev和尾结点next总是指向null，因此对链表的访问总以null为终点
 * 表头和表尾指针:list带有head 和tail指针直接指向头结点和尾结点，算法复杂度为O(1)
 * 结点计数器:通过len属性获取链表长度算法赋值度为O(1)
