if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
}

class PositionClient {

    #cordX;
    #cordY;

    /**
     * @constructor Creates an instance of Position on client-side
     * @param {number} cordX x coordinate
     * @param {number} cordY y coordinate
     */
    constructor(cordX, cordY) {
        TypeChecker.isInt(cordX);
        TypeChecker.isInt(cordY);

        this.#cordX = cordX;
        this.#cordY = cordY;
    }

    /**
     * Gets x coordinate
     * 
     * @return cordX
     */
    getCordX() {
        return this.#cordX;
    }

    /**
     * Gets y coordinate
     * 
     * @return cordY
     */
    getCordY() {
        return this.#cordY;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = PositionClient;
}