class LoadingView extends Views {

    /**
     * @constructor Creates an instance of LoadingView
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