/**
 * The Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class WindowView extends ViewWithLanguageData {

    /**
     * @abstract abstract WindowView class
     */
    constructor() {
        super();

        if (new.target === WindowView) {
            throw new Error("Cannot construct abstract WindowView instances directly");
        }
    }
}