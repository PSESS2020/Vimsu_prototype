/**
 * The Loading View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class LoadingView extends Views {

    /**
     * Creates an instance of LoadingView
     * @constructor LoadingView
     */
    constructor() {
        super();

        if (!!LoadingView.instance) {
            return LoadingView.instance;
        }

        LoadingView.instance = this;
    }

    /**
     * Called when loading contents
     * 
     * @param {number} totalContents total contents
     * @param {number} loadedContents loaded contents
     */
    contentLoaded(totalContents, loadedContents) {
        var percentage = ((100 / totalContents * loadedContents) << 0) + "%";
        $("#progressbar")[0].style.width = percentage;
        $("#progressstatus")[0].innerHTML = "Loading Conference " + percentage + " . . .";
    }

    /**
     * Called when loading contents done
     */
    doneLoading() {
        $("#overlay")[0].style.opacity = 0;
    }
}