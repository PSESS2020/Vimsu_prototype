const TypeOfTask = require("../../utils/TypeOfTask");
const Level = require("../rewards/Level");
const Task = require("../rewards/Task");

class LevelFactory {

    constructor() {
        if (!!LevelFactory.instance) {
            return LevelFactory.instance;
        }
        LevelFactory.instance = this;
    }

    createLevel ({ counter, color, points }, taskStrucForLevel) {
        // TypeChecking
        // Also, counter structure may need to be redone to match taskStruc
        var newLevel = new Level(counter, color, points, taskStrucForLevel)
        var fn = this.#writeCheckForUnlockMethod(taskStrucForLevel)
        return Object.defineProperty(newLevel, 'checkForUnlock', { value: new Function('ppant', fn), writable: false })      
    }

    #writeCheckForUnlockMethod = function (taskStruc) {
        var fn = ""
        if (Array.isArray(taskStruc)) {
            fn += `return (`
            for (i in [...Array(taskStruc.length)]) {
                fn += `${(i >= 1) ? " || " : ""}(`
                if (!Array.isArray(taskStruc[i])) {
                    fn += `this.counter[${i}] <= ppant.getTaskCounterValue(this.taskStruc[${i}])`
                } else {
                    for (j in [...Array(taskStruc[i].length)]) {
                        fn += `${(j >= 1) ? " && " : ""}(this.counter[${i}][${j}] <= ppant.getTaskCounterValue(this.taskStruc[${i}][${j}]))`
                    }
                }
                fn += `)`
            }
            fn += `)`
        } else {
            fn += `return (this.counter <= ppant.getTaskCounterValue(this.taskStruc))`
        }      
        return fn
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = LevelFactory;
}