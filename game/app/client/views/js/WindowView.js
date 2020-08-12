if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views')
}

class WindowView extends Views {

    constructor() {
        super();
    }

    draw() {
        throw new Error('draw() has to be implemented!');
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = WindowView;
}