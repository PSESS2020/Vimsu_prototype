var GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
var Position = require('../models/Position.js')
var TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const Settings = require('../../client/shared/Settings.js');

module.exports = class GameObjectService {

    #gameObjectIDs;

    constructor() {
        if (!!GameObjectService.instance) {
            return GameObjectService.instance;
        }

        GameObjectService.instance = this;
        this.#gameObjectIDs = [];
    }

    #generateGameObjectID = function () {
        let idIsGenerated = false;
        while (!idIsGenerated) {
            let id = Math.floor((Math.random() * 1000000) - 500000);
            if (!this.#gameObjectIDs.includes(id)) {
                idIsGenerated = true;
                this.#gameObjectIDs.push(id);
                return id;
            }
        }
    }

    createTable(roomId, width, length, xPos, yPos, solidity) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isBoolean(solidity);

        return new GameObject(this.#generateGameObjectID(), "table" + 1, width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createSchedule(roomId, width, length, xPos, yPos, solidity) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isBoolean(solidity);

        return new GameObject(this.#generateGameObjectID(), "schedule" + 1, width, length, new Position(roomId, xPos, yPos), solidity);
    }

}