var TypeChecker = require('../../utils/TypeChecker.js');


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

        if(cordX instanceof Array) {
            cordX.forEach(x => {
                TypeChecker.isInt(x);
            })
        } else {
            TypeChecker.isInt(cordX);
        }
        
        if(cordY instanceof Array) {
            cordY.forEach(y => {
                TypeChecker.isInt(y);
            })
        } else {
            TypeChecker.isInt(cordY);
        }
        
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
