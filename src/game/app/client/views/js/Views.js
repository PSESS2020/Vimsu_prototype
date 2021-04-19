/**
 * The Views
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class Views {

    isVisible;

    /**
     * @abstract abstract Views class
     */
    constructor() {
        if (new.target === Views) {
            throw new Error("Cannot construct abstract Views instances directly");
        }
    }

    /**
     * Sets visibility
     * 
     * @param {boolean} visible true if visible, otherwise false
     */
    setVisibility(visible) {
        TypeChecker.isBoolean(visible);
        this.isVisible = visible;
    }

     /**
     * Gets visibility
     * 
     * @return {boolean} true if visible, otherwise false
     */
    isVisible() {
        return this.isVisible;
    }

    /**
     * @abstract abstract draw method
     */
    draw() {
        throw new Error('draw() has to be implemented!');
    }
}