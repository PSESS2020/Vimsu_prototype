const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const Room = require('../models/Room.js');
const RoomDimensions = require('../utils/RoomDimensions.js');
const FoyerRoomDecorator = require('../models/FoyerRoomDecorator.js');
const FoodcourtRoomDecorator = require('../models/FoodcourtRoomDecorator.js');
const ReceptionRoomDecorator = require('../models/ReceptionRoomDecorator.js');
const EscapeRoomDecorator = require('../models/EscapeRoomDecorator.js');
const Settings = require('../utils/Settings.js');
const Floorplan = require('../utils/Floorplan.js');
const RoomDecorator = require('../models/RoomDecorator.js');
const RoomFactory = require('../models/RoomFactory.js');

/**
 * The Room Service
 * @module RoomService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class RoomService {
    #rooms;
    #roomFactory;

    /**
     * Creates an instance of RoomService
     * @constructor 
     */
    constructor() {
        if (!!RoomService.instance) {
            return RoomService.instance;
        }

        this.#rooms = [];
        this.#roomFactory = new RoomFactory();
        this.#initAllRooms();
        RoomService.instance = this;
    }

    /**
     * Gets all rooms
     * @method module:RoomService#getAllRooms
     * 
     * @return {Room[]} rooms array
     */
    getAllRooms() {
        return this.#rooms;
    }

    /**
     * Gets room by its ID
     * @method module:RoomService#getRoom
     * 
     * @param {number} roomId room ID
     * 
     * @return {RoomDecorator} RoomDecorator instance
     */
    getRoom(roomId) {
        TypeChecker.isInt(roomId);

        let index = this.#rooms.findIndex(room => room.getRoom().getRoomId() === roomId);

        if (index < 0) {
            throw new Error(roomId + " is not in list of rooms")
        }

        return this.#rooms[index];
    }

    /**
     * @private Initializes all rooms
     * @method module:RoomService#initAllRooms
     */
    #initAllRooms = function () {
        let listToBuild = Object.entries(Floorplan);
        listToBuild.forEach(roomData => {
            if (this.#roomNotAlreadyCreated(roomData[1].ID)) {
                this.#rooms.push(this.#roomFactory.buildRoomFrom(roomData[1]));
            }
        })
    }

    /**
     * @method module:RoomService#roomNotAlreadyCreated
     * 
     * @param {String} roomId 
     * @returns {Boolean} Whether room with the passed id has 
     *                    not been created yet
     */
    #roomNotAlreadyCreated = function (roomId) {
        for (let i = 0; i < this.#rooms.length; i++) {
            let room = this.#rooms[i];
            if (room.getRoomId() == roomId) {
                return false;
            }
        }
        return true;
    }
} 