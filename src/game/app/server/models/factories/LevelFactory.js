const TypeOfTask = require("../../utils/TypeOfTask");
const Task = require("../rewards/Task");

class LevelFactory {

    constructor() {
        if (!!LevelFactory.instance) {
            return LevelFactory.instance;
        }
        LevelFactory.instance = this;
    }

    createLevel (counter, color, points) {
        
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = LevelFactory;
}