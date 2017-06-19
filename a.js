function setTimeOutSelf() {
    this.x    = 'self';
    this.out1 = function () {
        setTimeout(function () {
            console.log(`this.x -> ${this.x}`);
        }, 1000)
    };
    this.out2 = function () {
        setTimeout(function () {
            console.log(`this.x -> ${this.x}`);
        }.bind({x:'out'}).bind(this), 1000);
    };
    this.out3 = function () {
        setTimeout((()=> {
            console.log(`this.x -> ${this.x}`);
        }).bind({x:'out'}), 1000)
    }
}
const TOS=new setTimeOutSelf();
TOS.out1();//this.x -> undefined
TOS.out2();//this.x -> out
TOS.out3();//this.x -> self