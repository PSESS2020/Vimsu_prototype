const TypeChecker = require("../../../client/shared/TypeChecker")

/**
 * The Level Model
 * @module Level
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class Level {

    #counter
    #color
    #awardPoints
    #taskStruc

    // may need an id field
    constructor (counter, color, points, taskStruc) {
        this.#counter     = counter
        this.#color       = color
        this.#awardPoints = points
        this.#taskStruc   = taskStruc
    }

    getColor() { return this.#color }

    getPoints() { return this.#awardPoints }

    checkForUnlock() { 
        throw new Error(`Error on calling checkForUnlock of Level ${this}. Needs to be implemented by LevelFactory on construction.`) 
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Level;
}