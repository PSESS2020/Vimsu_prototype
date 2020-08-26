const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const Room = require('../models/Room.js');
const RoomDimensions = require('../utils/RoomDimensions.js');
const FoyerRoomDecorator = require('../models/FoyerRoomDecorator.js');
const FoodcourtRoomDecorator = require('../models/FoodcourtRoomDecorator.js');
const ReceptionRoomDecorator = require('../models/ReceptionRoomDecorator.js');
const Settings = require('../utils/Settings.js');

module.exports = class RoomService {
    #rooms;

    /**
     * @constructor Creates an instance of RoomService
     */
    constructor() {
        if (!!RoomService.instance) {
            return RoomService.instance;
        }

        this.#rooms = [];
        this.#initAllRooms();
        RoomService.instance = this;
    }

    /**
     * Gets all rooms
     * 
     * @return rooms array
     */
    getAllRooms() {
        return this.#rooms;
    }

    /**
     * Gets room by its ID
     * 
     * @param {number} roomId room ID
     * 
     * @return RoomDecorator instance
     */
    getRoom(roomId) {
        TypeChecker.isInt(roomId);

        let index = this.#rooms.findIndex(room => room.getRoomId() === roomId);

        if (index < 0) {
            throw new Error(roomId + " is not in list of rooms")
        }

        return this.#rooms[index];
    }

    /**
     * @private Initializes all rooms
     */
    #initAllRooms = function() {
        this.#rooms.push(new FoyerRoomDecorator(new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH)));
        this.#rooms.push(new FoodcourtRoomDecorator(new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH)));
        this.#rooms.push(new ReceptionRoomDecorator(new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH)));
    }
} 