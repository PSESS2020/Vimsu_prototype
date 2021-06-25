const TypeChecker = require("../../../client/shared/TypeChecker");
const Level = require("../rewards/Level");

/**
 * Custom List class that guarantees that each contained element
 * is an instance of the Level class or the LevelList class
 * @module LevelList
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class LevelList extends Array {
    constructor(...values) {
        let numberOfArgs = values.length
        if (numberOfArgs === 0) { super() }
        else if (numberOfArgs === 1) {
            let len = values[0]
            if (typeof len === 'number') { super(len) }
            else { 
                TypeChecker.isInstanceOf(len, Level)
                super(len)
            }
        }
        else {
            values.forEach( level => TypeChecker.isInstanceOf(level, Level) )
            super(values)
        }
    }

    concat(levelList) {

    }

    fill(level) {

    }

    join() {

    }

    push(level) {

    }

    unshift(...levels) {

    }

    addLevels(levelList) {

    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = LevelList;
}