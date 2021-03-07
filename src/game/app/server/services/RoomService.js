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

/**
 * The Room Service
 * @module RoomService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class RoomService {
    #rooms;
    #floorplan;

    /**
     * Creates an instance of RoomService
     * @constructor 
     */
    constructor() {
        if (!!RoomService.instance) {
            return RoomService.instance;
        }

        this.#rooms = [];
        this.#floorplan;
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
        this.#rooms.push(new FoyerRoomDecorator(new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH)));
        this.#rooms.push(new FoodcourtRoomDecorator(new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH)));
        this.#rooms.push(new ReceptionRoomDecorator(new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH)));
        this.#rooms.push(new EscapeRoomDecorator(new Room(Settings.ESCAPEROOM_ID, TypeOfRoom.ESCAPEROOM, RoomDimensions.ESCAPEROOM_WIDTH, RoomDimensions.ESCAPEROOM_LENGTH)));

        for(const [room,data] of Object.entries(Floorplan)) {
            this.#rooms.push(
                new Room(
                    new Room(/*id, type, width, length*/)
                )
            )
        };
    }
} 