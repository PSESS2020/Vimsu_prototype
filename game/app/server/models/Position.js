const TypeChecker = require('../../client/shared/TypeChecker.js');


module.exports = class Position {

    #roomId;
    #cordX;
    #cordY;

    /**
     * Erstellt Positionsinstanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {int} cordX 
     * @param {int} cordY 
     */
    constructor(roomId, cordX, cordY) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(cordX);
        TypeChecker.isInt(cordY);

        this.#roomId = roomId;
        this.#cordX = cordX;
        this.#cordY = cordY;
    }

    getRoomId() {
        return this.#roomId;
    }

    getCordX() {
        return this.#cordX;
    }

    getCordY() {
        return this.#cordY;
    }
}
