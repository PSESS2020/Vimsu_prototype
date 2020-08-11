
var RoomDecorator = require('../models/RoomDecorator.js');
var RoomDimensions = require('../../utils/RoomDimensions.js');

module.exports = class ReceptionRoomDecorator extends RoomDecorator {
    #room;

    constructor(room) {
        super();
        this.#room = room;
    }

    getRoom() {
        return this.#room;
    }
}