/**
 * The Views
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class Views {

    /**
     * @abstract abstract Views class
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