var GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../../../config/TypeChecker.js');
var Position = require('../models/Position.js')
var TypeOfRoom = require('../../utils/TypeOfRoom.js');
const Settings = require('../../utils/Settings.js');

module.exports = class GameObjectService {

    #objects;

    constructor() {
        if(!!GameObjectService.instance){
            return GameObjectService.instance;
        }

        GameObjectService.instance = this;
        this.#objects = [];
    }

    /*getObjects(roomId)
    {
        TypeChecker.isInt(roomId);
        
        var roomObjects = [], i;

        for(i = 0; i < this.#objects.length; i++){
            if (this.#objects[i].getPosition().getRoomId() === roomId) {
                roomObjects.push(this.#objects[i]);
            }
        }

        if (roomObjects.length < 1) {
            throw new Error("there are no objects in this " + roomId)
        }

        return roomObjects;
    }*/

    /*getObject(id)
    {
        TypeChecker.isInt(id);

        let index = this.#objects.findIndex(object => object.getId() === id);

        if (index < 0) 
        {
            throw new Error(id + " is not in list of objects")
        }

        return this.#objects[index];
    }*/

    randomInt() {
        return Math.floor((Math.random() * 1000000) - 500000);
    };

    createTable(roomId, width, heigth, xPos, yPos, solidity) {
        return new GameObject(this.randomInt(), "table" + 1, width, heigth, new Position(roomId, xPos, yPos), solidity);
    }

    createSchedule(roomId, width, heigth, xPos, yPos, solidity) {
        return new GameObject(this.randomInt(), "schedule" + 1, width, heigth, new Position(roomId, xPos, yPos), solidity);
    }

}
