var TypeChecker = require('../../client/utils/TypeChecker.js');
var TypeOfRoom = require('../models/TypeOfRoom.js');
var Room = require('../models/Room.js');

module.exports = class RoomService {
    #rooms;

    constructor() {
        if(!!RoomService.instance){
            return RoomService.instance;
        }

        RoomService.instance = this;
        this.#rooms = [];
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
        this.#rooms.push(new Room(1, TypeOfRoom.FOYER));
    }
} 