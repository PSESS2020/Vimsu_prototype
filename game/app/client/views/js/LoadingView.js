class LoadingView extends Views {

    constructor() {
        super();
    }

    contentLoaded(totalContents, loadedContents) {
        var percentage = ((100 / totalContents * loadedContents) << 0) + "%";
        $("#progressbar")[0].style.width = percentage;
        $("#progressstatus")[0].innerHTML = "Loading Conference " + percentage + " . . .";
    }

    doneLoading() {
        $("#overlay")[0].style.opacity = 0;
    }
}