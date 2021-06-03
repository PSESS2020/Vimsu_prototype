/**
 * The Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class WindowView extends ViewWithLanguageData {

    /**
     * @abstract abstract WindowView class
     * 
     * @param {json} languageData language data for specific view
     */
    constructor(languageData) {
        super(languageData);

        if (new.target === WindowView) {
            throw new Error("Cannot construct abstract WindowView instances directly");
        }
    }
}