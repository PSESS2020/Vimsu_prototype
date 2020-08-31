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
     * @private checks parameters' data type
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    #checkParamTypes = function (roomId, width, length, xPos, yPos, solidity, clickable) {
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
     * The game object names needs to be unique equivalent to the asset keys in the room decorators. 
     * If a new object with an unknown object type is added, then the new ObjectType has to be added to GameObjectType.js.
     * Further a new ObjectView.js needs to be implemented in the client and added to the GameObjectViewFactory.js.
     * Also when objects should overlap, then first push the background object to the object array and then the foreground objects.
     */

    //Tiles

    /**
     * creates default tile
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createDefaultTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.TILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //This two tiles below are special therefor they have the same name as default tile

    /**
     * creates default left tile
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createDefaultLeftTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right tile
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createDefaultRightTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Walls

    /**
     * creates default left wall
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createDefaultLeftWall(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftwall_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right wall
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createDefaultRightWall(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwall_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Tables

    /**
     * creates default table
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createTable(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.TABLE, "table_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default small dinner table
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createSmallDinnerTable(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SMALLDINNERTABLE, "smalldinnertable_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates right dinner table
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createRightDinnerTable(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTTABLE, "righttable_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Canteen

    /**
     * creates canteen counter
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createCanteenCounter(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CANTEENCOUNTER, "canteencounter_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates drinking machine
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createDrinkingMachine(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.DRINKS, "drinks_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Chairs
    /**
     * creates default left chair
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createLeftChair(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "leftchair_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right chair
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createRightChair(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "rightchair_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default left chair's back
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createLeftChairBack(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "leftchairback_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right chair's back
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createRightChairBack(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "rightchairback_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Plants

    /**
     * creates default plant
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createPlant(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.PLANT, "plant_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Sofas

    /**
     * creates default left sofa
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createLeftSofa(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SOFA, "leftsofa_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right sofa
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createRightSofa(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SOFA, "rightsofa_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Window

    /**
     * creates default left window
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createLeftWindowDefault(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftwindow_default0", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right window
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     */
    createRightWindowDefault(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwindow_default0", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Wall Frames

    /**
     * creates right wall frames
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
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
     * creates left schedule
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
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
     * creates left conference logo
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
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