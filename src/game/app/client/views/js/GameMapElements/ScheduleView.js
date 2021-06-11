/**
 * The Schedule Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ScheduleView extends GameMapElementView {
    eventManager;

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
        this.eventManager = eventManager;
    }
    
    /**
     * Called if participant clicks the schedule
     * 
     * @param {number} mousePos mouse position
     */
    onclick(mousePos) {

        if (super.getClickMapValueWithGridCoords(mousePos) === 1) {
            $('#noschedule').empty();
            $('#scheduleModal .modal-body #schedule > tbody:last-child').empty();
            $('#scheduleModal').modal('show');
            $('#scheduleWait').show();
            this.eventManager.handleScheduleClicked();
        }
    }
}