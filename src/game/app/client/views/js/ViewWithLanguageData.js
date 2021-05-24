/**
 * The ViewWithLanguageData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class ViewWithLanguageData extends Views {

    languageData;

    /**
     * @abstract abstract ViewWithLanguageData class
     */
    constructor() {
        super();

        if (new.target === ViewWithLanguageData) {
            throw new Error("Cannot construct abstract ViewWithLanguageData instances directly");
        }
    }

    /**
     * Sets language data
     * 
     * @param {json} languageData language data
     */
    setLanguageData(languageData) {
        this.languageData = languageData;
    }
}