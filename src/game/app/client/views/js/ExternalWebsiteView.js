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
     * @param {String} url URL
     * @param {String} gameObjectID
     */
     draw(url, gameObjectID) {
        $('#externalWebsiteWait' + gameObjectID).hide()
        $(`#externalWebsiteWaitModal${gameObjectID} .modal-header`).empty()
        $('#externalWebsiteBody' + gameObjectID).empty();

        $('#externalWebsiteBody' + gameObjectID).append(`
            <div class="modal-body modal-body-large">
                <p style="text-align:center">
                    <iframe id="iframe" src=${url} width=100% height=100% frameborder="2" allowfullscreen></iframe>
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
                            <div class="modal-body modal-body-large">
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