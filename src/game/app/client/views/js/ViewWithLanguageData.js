/**
 * The ViewWithLanguageData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class ViewWithLanguageData extends AbstractView {

    languageData;

    /**
     * @abstract abstract ViewWithLanguageData class
     * 
     * @param {json} languageData language data for specific view
     */
    constructor(languageData) {
        super();

        if (new.target === ViewWithLanguageData) {
            throw new Error("Cannot construct abstract ViewWithLanguageData instances directly");
        }

        this.languageData = languageData;
    }
}