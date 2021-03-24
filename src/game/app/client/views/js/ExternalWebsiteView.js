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
     * @param {String} iFrameData.url URL of iFrame
     * @param {number} iFrameData.width width of iframe in px
     * @param {number} iFrameData.height height of iframe in px
     * @param {String} gameObjectID GameObject Id
     */
     draw(iFrameData, gameObjectID) {
        $('#externalWebsiteWait' + gameObjectID).hide()
        $(`#externalWebsiteWaitModal${gameObjectID} .modal-header`).empty()
        $('#externalWebsiteBody' + gameObjectID).empty();

        let fullScreenMode = false;
        let width = iFrameData.width.toString() + 'px';
        let height = iFrameData.height.toString() + 'px';

        $('#externalWebsiteBody' + gameObjectID).append(`
            <div class="modal-body" style="overflow:auto; height:${height};">
                <p style="text-align:center">
                    <iframe id=${"iframe" + gameObjectID} frameborder="1" src=${iFrameData.url} width=${width} height=${height} 
                        allowfullscreen scrolling="no" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
                </p>
            </div>
        `);

        $('#fullscreenBtn' + gameObjectID).off();
        $('#fullscreenBtn' + gameObjectID).on('click', (event) => {
            event.preventDefault();

            let iFrame = document.getElementById("iframe" + gameObjectID);
            let window = document.getElementById("externalWebsiteModal" + gameObjectID);

            if (!fullScreenMode) {
            
                iFrame.width = '100%';
                iFrame.height = '100%';
                iFrame.scrolling= 'yes';

                if (window.requestFullscreen) {
                    window.requestFullscreen();
                } else if (window.webkitRequestFullscreen) { /* Safari */
                    window.webkitRequestFullscreen();
                } else if (window.msRequestFullscreen) { /* IE11 */
                    window.msRequestFullscreen();
                }

                fullScreenMode = true;
            } else {
        
                iFrame.width = iFrameData.width;
                iFrame.height = iFrameData.height;
                iFrame.scrolling= 'no';

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }

                fullScreenMode = false;
            }
        });
     }
    
    /**
     * Add new External Website window
     * 
     * @param {String} gameObjectID GameObject id
     */
     addNewExternalWebsiteWindow(gameObjectID) {
        if (!($('#externalWebsiteModal' + gameObjectID).length)) {
            $('#externalWebsiteModalCollection').append(`
                <div class="modal fade" id="externalWebsiteModal${gameObjectID}" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered mw-100 w-75" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id=${"externalWebsiteModalTitle" + gameObjectID}></h5>
                                <div class="d-flex flex-row justify-content-end">
                                    <div>
                                        <button id=${"fullscreenBtn" + gameObjectID} class="close btn">
                                            <i class="fa fa-window-maximize" style=" transform: scale(0.8); margin-top: 1px;"></i>
                                        </button>
                                    </div>
                                    <div>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-body">
                                <div id="externalWebsiteWait${gameObjectID}" style="text-align: center;">
                                    <i class="fas fa-circle-notch fa-spin fa-2x"></i>
                                </div>
                                <div id="externalWebsiteBody${gameObjectID}"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        }

        $('#externalWebsiteModal' + gameObjectID).modal('show');
    }
}