const GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Settings = require('../../utils/Settings.js');
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
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isBoolean(solidity);
    }

    /* ##################################################################### */
    /* ###################### GAMEOBJECT INFORMATIONS ###################### */
    /* ##################################################################### */

    /**
     * The game object names needs to be unique äquivalent to the asset keys in the room decorators. 
     * If a new object with an unknown object type is added, then the new ObjectType has to be added to GameObjectType.js.
     * Further a new ObjectView.js needs to be implemented in the client and added to the GameObjectViewFactory.js.
     */

    //Tiles
    createDefaultTile(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, 1, 1, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.TILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity);
    }

    //This two tiles below are special therefor they have the same name as default tile
    createDefaultLeftTile(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, 1, 1, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity);
    }

    createDefaultRightTile(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, 1, 1, xPos, yPos, solidity);

        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity);
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

    //Tables
    createTable(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity);


        return new GameObject(this.#generateGameObjectID(), GameObjectType.TABLE, "table_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity);

    }

    //Plants
    createPlant(roomId, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity);


        return new GameObject(this.#generateGameObjectID(), GameObjectType.PLANT, "plant_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity);

    }

    //Window
    createRightWindow(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwindow_default", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    //Wall Frames
    createRightWallFrame(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);
        let wallFrames = [];
        if (length > 1) {
            for (let i = 0; i < length; i++) {
                console.log("rightwallframe_default" + i)
                wallFrames.push(new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwallframe_default" + i, width, length, new Position(roomId, xPos, yPos + i), solidity));
            }
            return wallFrames;
        } else if (width > 1) {
            for (let i = 0; i < width; i++) {
                console.log("rightwallframe_default" + i)

                wallFrames.push(new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwallframe_default" + i, width, length, new Position(roomId, xPos, yPos + i), solidity));
            }
            return wallFrames;
        } else
            return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwallframe_default", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    //Schedules
    createLeftSchedule(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);
        let schedules = [];
        if (length > 1) {
            for (let i = 0; i < length; i++) {
                console.log("leftschedule_default" + i)
                schedules.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftschedule_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity));
            }
            return schedules;
        } else if (width > 1) {
            for (let i = 0; i < width; i++) {
                console.log("leftschedule_default" + i)

                schedules.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftschedule_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity));
            }
            return schedules;
        } else
            return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftschedule_default", width, length, new Position(roomId, xPos, yPos), solidity);
    }

    //Conference Logo
    createLeftConferenceLogo(roomId, width, length, xPos, yPos, solidity) {
        this.checkParamTypes(roomId, width, length, xPos, yPos, solidity);
        let conferenceLogos = [];
        if (length > 1) {
            for (let i = 0; i < length; i++) {
                console.log("leftconferencelogo_default" + i)
                conferenceLogos.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftconferencelogo_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity));
            }
            return conferenceLogos;
        } else if (width > 1) {
            for (let i = 0; i < width; i++) {
                console.log("leftconferencelogo_default" + i)

                conferenceLogos.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftconferencelogo_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity));
            }
            return conferenceLogos;
        } else
            return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftconferencelogo_default", width, length, new Position(roomId, xPos, yPos), solidity);
    }

}