if (typeof module === 'object' && typeof exports === 'object') {
    GameObjectView = require('./GameObjectView');
    EventManager = require('../../utils/EventManager')
}

class DoorView extends GameObjectView {
    #doorImage;
    //#position;
    #DOORTYPE;
    #name;

    constructor(doorImage, position, doorType, name) {
        super(doorImage, position);
        this.#doorImage = doorImage;
        //this.#position = position;
        this.#DOORTYPE = doorType;
        this.#name = name;
    }

    

    getDoorType() {
        return this.#DOORTYPE;
    }

    getName() {
        return this.#name;
    }

    draw() {
        ctx_map.drawImage(this.#doorImage, super.getPosition().getCordX(), super.getPosition().getCordY());
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