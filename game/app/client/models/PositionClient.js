if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
}

class PositionClient {

    #cordX;
    #cordY;

    /**
     * 
     * @param {number} cordX 
     * @param {number} cordY 
     */
    constructor(cordX, cordY) {
        TypeChecker.isInt(cordX);
        TypeChecker.isInt(cordY);

        this.#cordX = cordX;
        this.#cordY = cordY;
    }

    getCordX() {
        return this.#cordX;
    }

    getCordY() {
        return this.#cordY;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = PositionClient;
}