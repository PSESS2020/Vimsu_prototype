class DoorView extends GameMapElementView {
    #DOORTYPE;
    #eventManager;

    constructor(doorImage, position, doorType, doorScreenPositionOffset, name, eventManager) {
        super(doorImage, position, doorScreenPositionOffset, name);

        this.#DOORTYPE = doorType;
        this.#eventManager = eventManager;
    }

    getDoorType() {
        return this.#DOORTYPE;
    }

    onclick(targetRoomId) {
        if (this.#DOORTYPE === TypeOfDoor.LECTURE_DOOR) {
            this.#eventManager.handleLectureDoorClick();
        } else {
            this.#eventManager.handleDoorClick(targetRoomId);
        }
    }
}