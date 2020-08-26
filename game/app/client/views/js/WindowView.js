class WindowView extends Views {

    /**
     * @abstract @constructor abstract WindowView class
     */
    constructor() {
        super();

        if (new.target === WindowView) {
            throw new Error("Cannot construct abstract WindowView instances directly");
        }
    }

    /**
     * @abstract abstract draw method
     */
    draw() {
        throw new Error('draw() has to be implemented!');
    }
}