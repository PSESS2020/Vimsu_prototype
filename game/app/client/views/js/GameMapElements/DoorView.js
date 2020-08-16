if (typeof module === 'object' && typeof exports === 'object') {
    GameMapElementView = require('../GameMapElementView');
    EventManager = require('../../../utils/EventManager')
}

class DoorView extends GameMapElementView {
    #DOORTYPE;

    constructor(doorImage, position, doorType, doorScreenPositionOffset, name) {
        super(doorImage, position, doorScreenPositionOffset, name);

        this.#DOORTYPE = doorType;
    }

    getDoorType() {
        return this.#DOORTYPE;
    }

    onclick(targetRoomId) {
        let eventManager = new EventManager();
        
        if (this.#DOORTYPE === TypeOfDoor.LECTURE_DOOR) {
            eventManager.handleLectureDoorClick();
        } else {
            eventManager.handleDoorClick(targetRoomId);
        }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorView;
}