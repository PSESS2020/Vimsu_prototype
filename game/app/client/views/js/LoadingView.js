class LoadingView extends Views {
    #overlay;
    #bar;
    #status;

    constructor() {
        super();
        this.#overlay = $("#overlay");
        this.#bar = $("#progressbar");
        this.#status = $("#progressstatus");
    }

    contentLoaded(totalContents, loadedContents) {
        var percentage = ((100 / totalContents * loadedContents) << 0) + "%";
        this.#bar[0].style.width = percentage;
        this.#status[0].innerHTML = "Loading Game " + percentage + " . . .";
    }

    doneLoading() {
        this.#overlay[0].style.opacity = 0;
    }
}