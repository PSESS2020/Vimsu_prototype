const GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Settings = require('../utils/Settings.js');
const Position = require('../models/Position.js');


/**
 * The Game Object Service
 * @module GameObjectService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class GameObjectService {

    /* TODO:
     * createTile
     * createWall
     * createWindow
    */

    #gameObjectIDs;

    constructor() {
        if (!!GameObjectService.instance) {
            return GameObjectService.instance;
        }

        GameObjectService.instance = this;
        this.#gameObjectIDs = [];
    }

    /**
     * @private generates unique id for a GameObject instance
     * @method module:GameObjectService#generateGameObjectID
     * 
     * @return {number} unique id for GameObject
     */
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
     * @method module:GameObjectService#checkParamTypes
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * @param {?String} url URL if clicking this object opens an external website, otherwise undefined
     */
    #checkParamTypes = function (roomId, width, length, xPos, yPos, solidity, clickable, url) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isBoolean(solidity);
        TypeChecker.isBoolean(clickable);

        if (url !== undefined) 
            TypeChecker.isString(url);
    }

    #isKnownType = function (type) {
        if(!GameObjectType.hasOwnProperty(type)) {
            throw new TypeError(type + ' is not a known objecttype!')
        }
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
     * @method module:GameObjectService#createDefaultTile
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default tile
     */
    createDefaultTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.TILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //This two tiles below are special therefor they have the same name as default tile

    /**
     * creates default left tile
     * @method module:GameObjectService#createDefaultLeftTile
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default left tile
     */
    createDefaultLeftTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right tile
     * @method module:GameObjectService#createDefaultRightTile
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default right tile
     */
    createDefaultRightTile(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, 1, 1, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTTILE, "tile_default", 1, 1, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Walls

    /**
     * creates default left wall
     * @method module:GameObjectService#createDefaultLeftWall
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default left wall
     */
    createDefaultLeftWall(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftwall_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right wall
     * @method module:GameObjectService#createDefaultRightWall
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default right wall
     */
    createDefaultRightWall(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwall_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Tables

    /**
     * creates default table
     * @method module:GameObjectService#createTable
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default table
     */
    createTable(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.TABLE, "table_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default small dinner table
     * @method module:GameObjectService#createSmallDinnerTable
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * @param {?String} url URL if clicking this object opens an external website, otherwise undefined
     * 
     * @return {GameObject} default small dinner table
     */
    createSmallDinnerTable(roomId, xPos, yPos, solidity, clickable, url) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable, url);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SMALLDINNERTABLE, "smalldinnertable_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable, url);
    }

    /**
     * creates right dinner table
     * @method module:GameObjectService#createRightDinnerTable
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} right dinner table
     */
    createRightDinnerTable(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTTABLE, "righttable_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Reception

    /**
     * creates reception counter front part
     * @method module:GameObjectService#createReceptionCounterFrontPart
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} reception counter front part
     */
    createReceptionCounterFrontPart(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RECEPTIONCOUNTER, "receptionCounterFrontPart_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates reception counter left part
     * @method module:GameObjectService#createReceptionCounterLeftPart
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} reception counter front part
     */
    createReceptionCounterLeftPart(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RECEPTIONCOUNTERSIDEPART, "receptionCounterLeftPart_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates reception counter front part
     * @method module:GameObjectService#createReceptionCounterRightPart
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} reception counter right part
     */
    createReceptionCounterRightPart(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RECEPTIONCOUNTERSIDEPART, "receptionCounterRightPart_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Canteen

    /**
     * creates canteen counter
     * @method module:GameObjectService#createCanteenCounter
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} canteen counter
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

    //Food
    /**
     * creates default left koeriWurst
     * @method module:GameObjectService#createKoeriWurst
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} left koeriWurst
     */
    createKoeriWurst(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SMALLDINNERTABLEFOOD, "koeriWurst_allSide", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates small left koeriWurst at upper side of table
     * @method module:GameObjectService#createUpperSideKoeriWurst
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} small left koeri wurst for upper side of table
     */
    createUpperSideKoeriWurst(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SMALLDINNERTABLEFOOD, "koeriWurst_upperSide", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates small left koeriWurst at lower side of table
     * @method module:GameObjectService#createLowerSideKoeriWurst
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} small left koeriWurst for lower side of table
     */
    createLowerSideKoeriWurst(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SMALLDINNERTABLEFOOD, "koeriWurst_lowerSide", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates small left koeriWurst at both sides of table
     * @method module:GameObjectService#createBothSidesKoeriWurst
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} small left koeriWurst for both sides of table
     */
    createBothSidesKoeriWurst(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SMALLDINNERTABLEFOOD, "koeriWurst_bothSides", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates cup of tea
     * @method module:GameObjectService#createTea
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} cup of tea
     */
    createTea(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SMALLDINNERTABLEFOOD, "tea_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }



    //Chairs
    /**
     * creates default left chair
     * @method module:GameObjectService#createLeftChair
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default left chair
     */
    createLeftChair(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "leftchair_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right chair
     * @method module:GameObjectService#createRightChair
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default right chair
     */
    createRightChair(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "rightchair_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default left chair's back
     * @method module:GameObjectService#createLeftChairBack
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} left chair's back
     */
    createLeftChairBack(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "leftchairback_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right chair's back
     * @method module:GameObjectService#createRightChairBack
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} right chair's back
     */
    createRightChairBack(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.CHAIR, "rightchairback_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Plants

    /**
     * creates default plant
     * @method module:GameObjectService#createPlant
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default plant
     */
    createPlant(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.PLANT, "plant_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Sofas

    /**
     * creates default left sofa
     * @method module:GameObjectService#createLeftSofa
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default left sofa
     */
    createLeftSofa(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SOFA, "leftsofa_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right sofa
     * @method module:GameObjectService#createRightSofa
     * 
     * @param {number} roomId room ID
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default right sofa
     */
    createRightSofa(roomId, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.SOFA, "rightsofa_default", Settings.SMALL_OBJECT_WIDTH, Settings.SMALL_OBJECT_LENGTH, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Window

    /**
     * creates default left window
     * @method module:GameObjectService#createLeftWindowDefault
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} defult left window
     */
    createLeftWindowDefault(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTWALL, "leftwindow_default0", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    /**
     * creates default right window
     * @method module:GameObjectService#createRightWindowDefault
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} default right window
     */
    createRightWindowDefault(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwindow_default0", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }

    //Wall Frames

    /**
     * creates right wall frames
     * @method module:GameObjectService#createRightWallFrame
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} right wall frame
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
     * @method module:GameObjectService#createLeftSchedule
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} left schedule
     */
    createLeftSchedule(roomId, width, length, xPos, yPos, solidity, clickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        let schedules = [];
        if (length > 1) {
            for (let i = 0; i < length; i++) {
                schedules.push(new GameObject(this.#generateGameObjectID(), GameObjectType.LEFTSCHEDULE, "leftschedule_default" + i, width, length, new Position(roomId, xPos + i, yPos), solidity, clickable));
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
     * @method module:GameObjectService#createLeftConferenceLogo
     * 
     * @param {number} roomId room ID
     * @param {number} width room width
     * @param {number} length room length
     * @param {number} xPos x position
     * @param {number} yPos y position
     * @param {boolean} solidity true if solid, otherwise false
     * @param {boolean} clickable true if clickable, otherwise false
     * 
     * @return {GameObject} left conference logo
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

    /* ##################################################################### */
    /* ############################ NEW METHODS ############################ */
    /* ##################################################################### */

    /* The methods in this section are an attempt to replace some of the highly
     * specific methods from above by some new, more flexible methods. As a part
     * of this, the game objects in the GameObjectType-Class had to be changed a
     * bit. */

    createObject(roomId, type, xPos, yPos, isSolid, isClickable, url) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, isSolid, isClickable, url);
        this.#isKnownType(type);
        let objTypeData = GameObjectType[type];
        return new GameObject(roomId, this.#generateGameObjectID(), objTypeData.TYPE, objTypeData.NAME, objTypeData.WIDTH, objTypeData.LENGTH, new Position(roomId, xPos, yPos), isSolid, isClickable, url);
    }

    // replace GameObjectType with GameEnvStyle
    // do the same for tiles
    // do i really want to have this?
    createEnv(roomId, type, xPos, yPos, isSolid, isClickable) {
        this.#checkParamTypes(roomId, width, length, xPos, yPos, solidity, clickable);
        return new GameObject(this.#generateGameObjectID(), GameObjectType.RIGHTWALL, "rightwall_default", width, length, new Position(roomId, xPos, yPos), solidity, clickable);
    }


}