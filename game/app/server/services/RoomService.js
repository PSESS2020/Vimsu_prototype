const TypeChecker = require('../../client/shared/TypeChecker.js');
var TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
var Room = require('../models/Room.js');
const Settings = require('../../client/shared/Settings.js');

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
        this.#rooms.push(new Room(Settings.FOYER_ID, TypeOfRoom.FOYER));
        this.#rooms.push(new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT));
        this.#rooms.push(new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION));
    }
} 