const TypeChecker = require('../../../../config/TypeChecker.js');
var TypeOfRoom = require('../../utils/TypeOfRoom.js');
var Room = require('../models/Room.js');
var RoomDimensions = require('../../utils/RoomDimensions.js');
var FoyerRoomDecorator = require('../models/FoyerRoomDecorator.js');
var FoodcourtRoomDecorator = require('../models/FoodcourtRoomDecorator.js');
var ReceptionRoomDecorator = require('../models/ReceptionRoomDecorator.js');
const Settings = require('../../utils/Settings.js');

module.exports = class RoomService {
    #rooms;

    constructor() {
        if(!!RoomService.instance){
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

        if (index < 0) 
        {
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