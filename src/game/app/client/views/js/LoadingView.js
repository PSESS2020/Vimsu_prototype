/**
 * The Loading View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class LoadingView extends Views {

    /**
     * Creates an instance of LoadingView
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
        document.getElementById("progressbar").style.width = percentage;
        document.getElementById("progressstatus").innerHTML = "Loading Conference " + percentage + " . . .";
    }

    /**
     * Called when loading contents done
     */
    doneLoading() {
        document.getElementById("overlay").style.opacity = 0;
        $("#upperHUD").show();
        $("#middleHUD").show();
        $("#lowerHUD").show();
        $('#allchatMessageInput').trigger('focus');
    }
}