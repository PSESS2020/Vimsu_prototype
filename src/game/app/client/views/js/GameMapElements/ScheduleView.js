/**
 * The Schedule Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ScheduleView extends GameMapElementView {
    #clickMap;
    #eventManager;

    /**
     * @constructor Creates an instance of Schedule View
     * 
     * @param {Image} scheduleImage schedule image
     * @param {PositionClient} position schedule position
     * @param {number} screenPositionOffset schedule screen position offset
     * @param {string} name schedule name
     * @param {number[][]} clickMap schedule clickMap
     * @param {EventManager} eventManager event manager instance
     */
    constructor(scheduleImage, position, screenPositionOffset, name, clickMap, eventManager) {
        super(scheduleImage, position, screenPositionOffset, name);
        this.#clickMap = clickMap;
        this.#eventManager = eventManager;
    }

    getClickMapValueWithGridCoords(mousePos) {
        var screenPos = super.getScreenPosition();

        var clickImgCordX = Math.abs(Math.abs(screenPos.getCordX() - Math.round(mousePos.x)));
        
        var clickImgCordY = Math.abs((screenPos.getCordY() + super.getScreenPositionOffset().y) - Math.round(mousePos.y));

        return this.#clickMap[clickImgCordY][clickImgCordX];
    }
    
    /**
     * Called if participant clicks the schedule
     * 
     * @param {number} mousePos mouse position
     */
    onclick(mousePos) {

        if (this.getClickMapValueWithGridCoords(mousePos) === 1) {
            //This Event fires multiple times because of three parallel schedule images.
            //Not sure how to prevent this.
            this.#eventManager.handleScheduleClicked();
        }
    }
}