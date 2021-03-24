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

        let width = iFrameData.width.toString() + 'px';
        let height = iFrameData.height.toString() + 'px';

        $('#externalWebsiteBody' + gameObjectID).append(`
            <div class="modal-body" style="overflow:auto; height:${height};">
                <p style="text-align:center">
                    <iframe id="iframe" frameborder="1" src=${iFrameData.url} width=${width} height=${height} allowfullscreen scrolling="no"></iframe>
                </p>
            </div>
        `);
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
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
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