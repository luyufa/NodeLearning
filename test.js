const uint8Arr = new Uint8Array([5000, 4000]);
console.log(uint8Arr)//Uint8Array [ 136, 160 ]
const buf = Buffer.from(uint8Arr.buffer)
console.log(buf);//<Buffer 88 a0>
uint8Arr[0] = 256;//最大值
console.log(buf);//<Buffer 00 a0>


const buff1 = Buffer.from('abc');
const buff2 = Buffer.from(buff1);
buff1[0] = 0x62;
console.log(buff1);
console.log(buff2);



console.log(Buffer.alloc(5,'a'));//<Buffer 61 61 61 61 61>