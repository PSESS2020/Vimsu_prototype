var TypeChecker = require('../../utils/TypeChecker.js');
var TypeOfRoom = require('../models/TypeOfRoom.js');
var Room = require('../models/Room.js');

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
        this.#rooms.push(new Room(1, TypeOfRoom.FOYER));
        this.#rooms.push(new Room(2, TypeOfRoom.FOODCOURT));
        this.#rooms.push(new Room(3, TypeOfRoom.RECEPTION));
    }
} 