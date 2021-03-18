/**
 * The IFrame Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class IFrameObjectView extends GameObjectView {

    url;
    
    /**
     * Creates an instance of IFrameObjectView
     * 
     * @param {Image} objectImage object image
     * @param {PositionClient} gridPosition object position
     * @param {number} screenPositionOffset object screen position offset
     * @param {String} name object name
     * @param {String} url external website url
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name, url) {
        super(objectImage, clickMap, gridPosition, screenPositionOffset, name);
        TypeChecker.isString(url);

        this.url = url;
    }

    /**
     * Called if participant clicks the iFrameObject
     */
    onclick() {
        
        $(function () {
            $('#closeExternalWebsiteButton').off();
            $('#closeExternalWebsiteButton').on('click', (event) => {
                $('#externalWebsite').hide();
                document.getElementById('iframe').src = "";

                /* Needed to stop video after close button click */
                $('.iframeclass').each(function() {
                    this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
                });
            });
        });

        document.getElementById('iframe').src = this.url;
        $('#externalWebsite').show();
    }
}