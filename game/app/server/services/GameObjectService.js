const GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Settings = require('../../client/shared/Settings.js');
const Position = require('../models/Position.js')

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

    checkParamTypes(roomId, width, length, xPos, yPos, solidity) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isBoolean(solidity);
    }

    //Tiles
    createDefaultTile(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, 1, 1, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.TILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity);
    }
    
    createDefaultLeftTile(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, 1, 1, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTTILE, "lefttile_default", 1, 1, new Position(roomId, xPos, yPos), solidity);
    }
    
    createDefaultRightTile(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, 1, 1, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTTILE, "righttile_default", 1, 1, new Position(roomId, xPos, yPos), solidity);
    }

    //Walls
    createDefaultLeftWall(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftwall_default", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultRightWall(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwall_default", width, length, new Position(roomId, xPos, yPos), solidity);
    }


    /*//Doors
    createDefaultFoyerLeftDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "leftdoor_foyer", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultFoyerRightDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "rightdoor_foyer", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultReceptionLeftDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "leftdoor_reception", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultReceptionRightDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "rightdoor_reception", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultFoodcourtLeftDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "leftdoor_foodcourt", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultFoodcourtRightDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "rightdoor_foodcourt", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultLectureLeftDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "leftdoor_lecturedoor", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    createDeafultLectureRightDoor(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), "rightdoor_lecturedoor", width, length, new Position(roomId, xPos, yPos), solidity);
    }*/

    //Tables
    createTable(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, Settings.TABLE_WIDTH, Settings.TABLE_LENGTH, xPos, yPos, solidity);


        return new GameObject(this.#generateGameObjectID(), GameObjectType.TABLE, "table" + 1, Settings.TABLE_WIDTH, Settings.TABLE_LENGTH, new Position(roomId, xPos, yPos), solidity);

    }

    //Schedules
    createSchedule(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);


        return new GameObject(this.#generateGameObjectID(), GameObjectType.SCHEDULE, "schedule" + 1, width, length, new Position(roomId, xPos, yPos), solidity);
    }

}