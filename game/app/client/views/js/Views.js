class Views {

    /**
     * @abstract @constructor abstract Views class
     */
    constructor() {
        if (new.target === Views) {
            throw new Error("Cannot construct abstract Views instances directly");
        }
    }

    /**
     * @abstract abstract draw method
     */
    draw() {
        throw new Error('draw() has to be implemented!');
    }
}