const TypeChecker = require('../../client/shared/TypeChecker.js');

module.exports = class Position {

    #roomId;
    #cordX;
    #cordY;

    /**
     * @constructor Creates a Position instance
     * 
     * @param {number} roomId room ID
     * @param {number} cordX x coordinate
     * @param {number} cordY y coordinate
     */
    constructor(roomId, cordX, cordY) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(cordX);
        TypeChecker.isInt(cordY);

        this.#roomId = roomId;
        this.#cordX = cordX;
        this.#cordY = cordY;
    }

    /**
     * Gets Room ID
     * 
     * @return roomId
     */
    getRoomId() {
        return this.#roomId;
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
