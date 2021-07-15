/**
 * The AbstractView
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AbstractView {

    isVisible;

    /**
     * @abstract AbstractView class
     */
    constructor() {
        if (new.target === AbstractView) {
            throw new Error("Cannot construct AbstractView instance directly");
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