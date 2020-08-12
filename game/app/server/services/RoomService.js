const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const Room = require('../models/Room.js');
const RoomDimensions = require('../../utils/RoomDimensions.js');
const FoyerRoomDecorator = require('../models/FoyerRoomDecorator.js');
const FoodcourtRoomDecorator = require('../models/FoodcourtRoomDecorator.js');
const ReceptionRoomDecorator = require('../models/ReceptionRoomDecorator.js');
const Settings = require('../../client/shared/Settings.js');

module.exports = class RoomService {
    #rooms;

    constructor() {
        if (!!RoomService.instance) {
            return RoomService.instance;
        }

        this.#rooms = [];
        this.initAllRooms();
        RoomService.instance = this;
    }

    getAllRooms() {
        return this.#rooms;
    }

    getRoom(roomId) {
        TypeChecker.isInt(roomId);

        let index = this.#rooms.findIndex(room => room.getRoomId() === roomId);

        if (index < 0) {
            throw new Error(roomId + " is not in list of rooms")
        }

        return this.#rooms[index];
    }

    initAllRooms() {
        this.#rooms.push(new FoyerRoomDecorator(new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH)));
        this.#rooms.push(new FoodcourtRoomDecorator(new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH)));
        this.#rooms.push(new ReceptionRoomDecorator(new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH)));
    }
} 