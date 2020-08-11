var RoomDecorator = require('../models/RoomDecorator.js');


module.exports = class FoodcourtRoomDecorator extends RoomDecorator {
    #room;

    constructor(room) {
        super();
        this.#room = room;
    }

    getRoom() {
        return this.#room;
    }
}