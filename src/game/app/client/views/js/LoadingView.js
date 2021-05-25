/**
 * The Loading View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class LoadingView extends ViewWithLanguageData {

    /**
     * Creates an instance of LoadingView
     * 
     * @param {json} languageData language data for loading view
     */
    constructor(languageData) {
        super(languageData);

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
        document.getElementById("progressstatus").innerHTML = this.languageData.replace('percentagePlaceholder', percentage);
    }

    /**
     * Called when loading contents done
     */
    doneLoading() {
        document.getElementById("overlay").style.opacity = 0;
        setTimeout(() => {
            $("#hudHTML").show();
            $("#mapCanvas").show();
            $("#avatarCanvas").show();
            $("#windowHTML").show();
        }, 400)
    }
}