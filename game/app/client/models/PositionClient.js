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