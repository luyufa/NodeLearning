const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.setMaxListeners(9)

for (let i = 0; i < 11; i++) {
    emitter.on('event', function () {

    })
}