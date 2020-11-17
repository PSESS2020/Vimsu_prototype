/**
 * The Schedule Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ScheduleView extends GameMapElementView {
    #eventManager;

    /**
     * Creates an instance of Schedule View
     * 
     * @param {Image} scheduleImage schedule image
     * @param {PositionClient} position schedule position
     * @param {number} screenPositionOffset schedule screen position offset
     * @param {string} name schedule name
     * @param {EventManager} eventManager event manager instance
     */
    constructor(scheduleImage, clickMap, position, screenPositionOffset, name, eventManager) {
        super(scheduleImage, clickMap, position, screenPositionOffset, name);
        this.#eventManager = eventManager;
    }
    
    /**
     * Called if participant clicks the schedule
     * 
     * @param {number} mousePos mouse position
     */
    onclick(mousePos) {

        if (super.getClickMapValueWithGridCoords(mousePos) === 1) {
            //This Event fires multiple times because of three parallel schedule images.
            //Not sure how to prevent this.
            this.#eventManager.handleScheduleClicked();
        }
    }
}