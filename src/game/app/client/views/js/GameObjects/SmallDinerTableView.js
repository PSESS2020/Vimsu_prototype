/**
 * The Small Diner Table Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class SmallDinerTableView extends GameObjectView {
    
    /**
     * Creates an instance of SmallDinerTableView
     * 
     * @param {Image} objectImage smallDinerTable image
     * @param {PositionClient} gridPosition smallDinerTable position
     * @param {number} screenPositionOffset smallDinerTable screen position offset
     * @param {String} name smallDinerTable name
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name) {
        super(objectImage, clickMap, gridPosition, screenPositionOffset, name);
    }

    /**
     * Called if participant clicks the smallDinerTable
     */
    onclick() {
        $(document).ready(() => {
            $('#closeExternalWebsiteButton').off();
            $('#closeExternalWebsiteButton').on('click', (event) => {
                $('#externalWebsite').hide();

                /* Needed to stop video after close button click */
                $('.yt_player_iframe').each(function() {
                    this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
                });
            });
        });
        
        $('#externalWebsiteHeaderText').text("Table Video");
        $('#externalWebsite').show();
    }
}