if (typeof module === 'object' && typeof exports === 'object') {
    GameObjectView = require('./GameObjectView');
    EventManager = require('../../utils/EventManager')
}

class DoorView extends GameObjectView {
    #doorImage;
    #position;
    #DOORTYPE;

    constructor(doorImage, position, doorType) {
        super(doorImage, position);
        this.#doorImage = doorImage;
        this.#position = position;
        this.#DOORTYPE = doorType;
    }

    getPosition() {
        return this.#position;
    }

    getDoorType() {
        return this.#DOORTYPE;
    }

    draw() {
        ctx_map.drawImage(this.#doorImage, this.#position.getCordX(), this.#position.getCordY());
    }

    onclick() {
        let eventManager = new EventManager();
        if (this.#DOORTYPE === TypeOfDoor.LECTURE_DOOR) {
            eventManager.handleLectureDoorClick();
        }
        else if (this.#DOORTYPE === TypeOfDoor.FOODCOURT_DOOR) {
            eventManager.handleFoodCourtDoorClick();
        }
        else if (this.#DOORTYPE === TypeOfDoor.RECEPTION_DOOR) {
            eventManager.handleReceptionDoorClick();
        }
        else if (this.#DOORTYPE === TypeOfDoor.FOYER_DOOR) {
            eventManager.handleFoyerDoorClick();
        }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorView;
}