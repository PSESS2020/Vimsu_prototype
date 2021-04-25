/**
 * The External Website Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ExternalWebsiteView extends WindowView {

    /**
     * Creates an instance of ExternalWebsiteView
     */
    constructor() {
        super();

        if (!!ExternalWebsiteView.instance) {
            return ExternalWebsiteView.instance;
        }

        ExternalWebsiteView.instance = this;
    }

    /**
     * Draws External Website window
     * 
     * @param {Object} iFrameData iFrame data object
     * @param {String} iFrameData.title title of iFrame
     * @param {String} iFrameData.url URL of iFrame
     * @param {number} iFrameData.width width of iframe in px
     * @param {number} iFrameData.height height of iframe in px
     * @param {String} gameObjectID GameObject Id
     */
    draw(iFrameData, gameObjectID) {
        $('#externalWebsiteWindowWait' + gameObjectID).hide();
        $("#externalWebsiteWindowTitle" + gameObjectID).empty();
        $('#externalWebsiteWindowBody' + gameObjectID).empty();

        let fullScreenMode = false;
        let width = iFrameData.width.toString() + 'px';
        let height = iFrameData.height.toString() + 'px';

        $('#externalWebsiteWindowTitle' + gameObjectID).text(iFrameData.title);

        $('#externalWebsiteWindowBody' + gameObjectID).append(`
            <iframe id="iframe${gameObjectID}" class="iframeclass" frameborder="1" src=${iFrameData.url} width=${width} height=${height} 
                allowfullscreen scrolling="no" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        `);

        $('#fullscreenBtn' + gameObjectID).off();
        $('#fullscreenBtn' + gameObjectID).on('click', (event) => {
            event.preventDefault();

            document.getElementById("fullscreenBtn" + gameObjectID).style.opacity = 1;

            if (!fullScreenMode) {
                this.enterFullscreenMode(gameObjectID);
                fullScreenMode = true;
            } else {
                this.exitFullscreenMode(gameObjectID, width, height);
                fullScreenMode = false;
            }
        });

        $('#closeBtn' + gameObjectID).off();
        $('#closeBtn' + gameObjectID).on('click', (event) => {
            event.preventDefault();
            handleClose()
        });

        $(document).on('mouseup', (e) => {
            const externalWebsiteWindow = $(`#externalWebsiteWindow${gameObjectID}`);

            if (externalWebsiteWindow.is(':visible')) {
                const descendants = [externalWebsiteWindow];
                let isNotDescendant = true;

                descendants.forEach(descendant => {
                    isNotDescendant &&= !descendant.is(e.target) && descendant.has(e.target).length === 0;
                })

                // if the target of the click isn't the container nor a descendant of the container
                if (isNotDescendant) {
                    handleClose()
                }
            }
        });

        function handleClose() {
            if (fullScreenMode) {
                this.exitFullscreenMode(gameObjectID, width, height);
                fullScreenMode = false;
            }

            /* Needed to stop video */
            $('.iframeclass').each(function () {
                var el_src = $(this).attr("src");
                $(this).attr("src", el_src);
            });

            $('#externalWebsiteWindow' + gameObjectID).hide();
        }
    }

    /**
     * Enter FullscreenMode
     * 
     * @param {String} gameObjectID GameObject Id
     */
    enterFullscreenMode(gameObjectID) {
        document.getElementById("externalWebsiteWindow" + gameObjectID).style.width = '100%';
        document.getElementById("externalWebsiteWindow" + gameObjectID).style.height = '100%';
        document.getElementById("iframe" + gameObjectID).width = '100%';
        document.getElementById("iframe" + gameObjectID).height = '100%';
        document.getElementById("iframe" + gameObjectID).scrolling = 'yes';
    }

    /**
     * Exit FullscreenMode
     * 
     * @param {String} gameObjectID GameObject Id
     * @param {String} width width of iframe in px after exiting fullScreenMode
     * @param {String} height height of iframe in px after exiting fullScreenMode
     */
    exitFullscreenMode(gameObjectID, width, height) {
        document.getElementById("externalWebsiteWindow" + gameObjectID).style.width = '';
        document.getElementById("externalWebsiteWindow" + gameObjectID).style.height = '';
        document.getElementById("iframe" + gameObjectID).width = width;
        document.getElementById("iframe" + gameObjectID).height = height;
        document.getElementById("iframe" + gameObjectID).scrolling = 'no';
    }

    /**
     * Add new External Website window
     * 
     * @param {String} gameObjectID GameObject id
     */
    addNewExternalWebsiteWindow(gameObjectID) {
        if (!($('#externalWebsiteWindow' + gameObjectID).length)) {
            $('#externalWebsiteWindowCollection').append(`
                <div class="window" id="externalWebsiteWindow${gameObjectID}" style="z-index: 1050; max-width: 100%; max-height: 100%">
                    <div class="p-3 d-flex window-header">
                        <div id="externalWebsiteWindowTitle${gameObjectID}"></div>
                        <button id="fullscreenBtn${gameObjectID}" class="close btn ml-auto pl-2 pr-2">
                            <i class="fa fa-window-maximize" style=" transform: scale(0.8);"></i>
                        </button>
                        <button id="closeBtn${gameObjectID}" class="close btn pl-1 pr-1">
                            <i class="fa fa-close"></i>
                        </button>
                    </div>
                    <div class="p-3 window-content" style="overflow-y: hidden">
                        <div id="externalWebsiteWindowWait${gameObjectID}" style="text-align: center;">
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div id="externalWebsiteWindowBody${gameObjectID}" align="center"></div>
                    </div>
                </div>
            `)
        }

        $('#externalWebsiteWindow' + gameObjectID).show();
    }
}