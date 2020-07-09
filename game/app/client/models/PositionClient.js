class PositionClient {

    #cordX;
    #cordY;

    /**
     * Erstellt clientseitige Positionsinstanz
     * 
     * @author Philipp
     * 
     * @param {int} cordX 
     * @param {int} cordY 
     */
    constructor(cordX, cordY) {
        if (typeof cordX !== 'number' || typeof cordX !== 'number') {
            throw new TypeError(value + ' is not a number!')
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