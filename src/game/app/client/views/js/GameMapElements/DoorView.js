/**
 * The Door View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class DoorView extends GameMapElementView {
    DOORTYPE;
    eventManager;

    /**
     * Creates an instance of DoorView
     * 
     * @param {Image} doorImage door image
     * @param {PositionClient} position door position
     * @param {TypeOfDoor} doorType door type
     * @param {number} doorScreenPositionOffset door screen position offset
     * @param {String} name door name
     * @param {EventManager} eventManager event manager instance
     */
    constructor(doorImage, clickMap, position, doorType, doorScreenPositionOffset, name, eventManager) {
        super(doorImage, clickMap, position, doorScreenPositionOffset, name);

        this.DOORTYPE = doorType;
        this.eventManager = eventManager;
    }

    /**
     * Gets door type
     * 
     * @return {TypeOfDoor} door type
     */
    getDoorType() {
        return this.DOORTYPE;
    }

    /**
     * Called if participant clicks a door
     * 
     * @param {number} targetRoomId target room ID
     */
    onclick(targetRoomId) {
        if (this.DOORTYPE === TypeOfDoor.LEFT_LECTUREDOOR || this.DOORTYPE === TypeOfDoor.RIGHT_LECTUREDOOR) {
            this.eventManager.handleLectureDoorClick();
        } else {
            this.eventManager.handleDoorClick(targetRoomId);
        }
    }
}