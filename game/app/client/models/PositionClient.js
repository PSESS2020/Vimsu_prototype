
class PositionClient {

    #cordX;
    #cordY;

    /**
     * 
     * @param {int} cordX 
     * @param {int} cordY 
     */
    constructor(cordX, cordY) {
        if (typeof cordX !== 'number' || typeof cordY !== 'number') {
            throw new TypeError(cordX + ' or ' + cordY + ' is not a number!');
        }

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