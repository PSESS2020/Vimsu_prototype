var GameObject = require('../models/GameObject.js');
var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('../models/Position.js')
var TypeOfRoom = require('../models/TypeOfRoom.js');
var RoomDimensions = require('../models/RoomDimensions.js');

module.exports = class GameObjectService {

    #objects;

    constructor() {
        if(!!GameObjectService.instance){
            return GameObjectService.instance;
        }

        GameObjectService.instance = this;
        this.#objects = [];
    }

    getObjects(roomId, typeOfRoom)
    {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        var roomObjects = [], i;

        this.initAllObjects(roomId, typeOfRoom);

        for(i = 0; i < this.#objects.length; i++){
            if (this.#objects[i].getPosition().getRoomId() === roomId) {
                roomObjects.push(this.#objects[i]);
            }
        }

        if (roomObjects.length < 1) {
            throw new Error("there are no objects in this " + roomId)
        }

        return roomObjects;
    }

    getObject(id)
    {
        TypeChecker.isInt(id);

        let index = this.#objects.findIndex(object => object.getId() === id);

        if (index < 0) 
        {
            throw new Error(id + " is not in list of objects")
        }

        return this.#objects[index];
    }

    initAllObjects(roomId, typeOfRoom)
    {    
        if (typeOfRoom === 'FOYER') {
            /**for (var i = 1; i < RoomDimensions.FOYER_WIDTH + 1; i++) {
                for (var j = 1; j < RoomDimensions.FOYER_LENGTH + 1; i++) {
                    this.#objects.push(new GameObject(RoomDimensions.FOYER_LENGTH*(i-1)+j, "Tile" + RoomDimensions.FOYER_LENGTH*(i-1)+j, 1, 1, new Position(roomId, i, j), false));
                }
            }*/

            for (var i = 4; i < 9; i++)
                this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(roomId, i, 0), true));

            //Anderen Objekte für Foyer
        }

        else if (typeOfRoom === 'RECEPTION') {
            //Objekte für Rezeption
        }
    }
}
