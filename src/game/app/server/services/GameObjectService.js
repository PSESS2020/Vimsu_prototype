const GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Settings = require('../utils/Settings.js');
const Position = require('../models/Position.js')

/**
 * The Game Object Service
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
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

    /**
     * 
     * @param {number} roomId 
     * @param {number} width 
     * @param {number} length 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    #checkParamTypes = function(roomId, width, length, xPos, yPos, solidity, clickable) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isBoolean(solidity);
        TypeChecker.isBoolean(clickable);
    }

    /* ##################################################################### */
    /* ###################### GAMEOBJECT INFORMATIONS ###################### */
    /* ##################################################################### */

    /**
     * The game object names needs to be unique äquivalent to the asset keys in the room decorators. 
     * If a new object with an unknown object type is added, then the new ObjectType has to be added to GameObjectType.js.
     * Further a new ObjectView.js needs to be implemented in the client and added to the GameObjectViewFactory.js.
     * Also when objects should overlap, then first push the background object to the object array and then the foreground objects.
     */

    //Tiles

    /**
     * 
     * @param {number} roomId 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createDefaultTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.TILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //This two tiles below are special therefor they have the same name as default tile

    /**
     * 
     * @param {number} roomId 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createDefaultLeftTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * 
     * @param {number} roomId 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createDefaultRightTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Walls

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createDefaultLeftWall(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftwall_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createDefaultRightWall(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwall_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Tables

    /**
     * 
     * @param {number} roomId 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createTable(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.TABLE, "table_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Plants

    /**
     * 
     * @param {number} roomId 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createPlant(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.PLANT, "plant_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Sofas

    /**
     * 
     * @param {number} roomId 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createLeftSofa(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTSOFA, "leftsofa_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * 
     * @param {number} roomId 
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createRightSofa(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTSOFA, "rightsofa_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Window

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createLeftWindowDefault0(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftwindow_default0", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createRightWindowDefault0(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwindow_default0", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createRightWindowDefault1(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwindow_default1", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Wall Frames

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createRightWallFrame(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        let wallFrames = [];
        if (length > 1) {
            for (let i = 0; i < length; i++) {
         
                
                wallFrames.push(new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwallframe_default" + i, width, length, new Position(roomId, xPos, yPos + i), solidity, clickable));
            }
            return wallFrames;
        } else if (width > 1) {
            for (let i = 0; i < width; i++) {
              

                wallFrames.push(new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwallframe_default" + i, width, length, new Position(roomId, xPos, yPos + i), solidity, clickable));
            }
            return wallFrames;
        } else
            return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwallframe_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Schedules

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createLeftSchedule(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        let schedules = [];
        if (length > 1) {
            for (let i = 0; i < length; i++) {

                schedules.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftschedule_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity, clickable));
            }
            return schedules;
        } else if (width > 1) {
            for (let i = 0; i < width; i++) {

                schedules.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTSCHEDULE, "leftschedule_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity, clickable));
            }
            return schedules;
        } else
            return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTSCHEDULE, "leftschedule_default0", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Conference Logo

    /**
     * 
     * @param {number} roomId 
     * @param {number} width
     * @param {number} length
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {boolean} solidity 
     * @param {boolean} clickable 
     */
    createLeftConferenceLogo(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        let conferenceLogos = [];
        if (length > 1) {
            for (let i = 0; i < length; i++) {
             
                conferenceLogos.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftconferencelogo_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity, clickable));
            }
            return conferenceLogos;
        } else if (width > 1) {
            for (let i = 0; i < width; i++) {

                conferenceLogos.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftconferencelogo_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity, clickable));
            }
            return conferenceLogos;
        } else
            return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftconferencelogo_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }
}