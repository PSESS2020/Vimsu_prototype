const TypeChecker = require('../../client/shared/TypeChecker.js');

/**
 * The Position Model
 * @module Position
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Position {

    #roomId;
    #cordX;
    #cordY;

    /**
     * Creates a Position instance
     * @constructor module:Position
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
     * @method module:Position#getRoomId
     * 
     * @return {int} roomId
     */
    getRoomId() {
        return this.#roomId;
    }

    /**
     * Gets x coordinate
     * @method module:Position#getCordX
     * 
     * @return {int} cordX
     */
    getCordX() {
        return this.#cordX;
    }

    /**
     * Gets y coordinate
     * @method module:Position#getCordY
     * 
     * @return {int} cordY
     */
    getCordY() {
        return this.#cordY;
    }
}
