## redis设计实现-压缩列表
> 压缩列表，一种为节约内存，在内存中连续的数据结构。


###### 压缩列表结点


prev_entry_length | encoding | content
---|---|---


`prev_entry_length`:已字节为单位，记录前一个结点的长度，因此，压缩列表可以由后向前遍历

`encoding`:记录`content`保存的数据类型和长度

`content`:压缩列表结点保存的值，该值是一个字节数组或整数



###### 压缩列表

zlbytes | zltail | zllen | zlEntryNode....|zlend
---|---|---|---|---

`zlbytes`:压缩列表长度

`zltail`:压缩列表表尾距离起始地址多少字节

`zllen`:压缩列表结点数量,如果小于`UINT16_MAX`值时`zllen`便是结点真实数量，如果等于`UINT16_MAX`,则需要遍历列表才能获取结点数量

`zlEntryNode`:压缩列表结点

`zlend`: `0XFF`用于标记压缩列表末端



###### 连锁更新

`prev_entry_length`

* 如果前一节点的长度小于 254 字节， 那么 previous_entry_length 属性需要用 1 字节长的空间来保存这个长度值。

* 如果前一节点的长度大于等于 254 字节， 那么 previous_entry_length 属性需要用 5 字节长的空间来保存这个长度值。
*

在一个压缩列表中， 有多个连续的、长度介于 250 字节到 253 字节之间的节点，会导致连锁更新