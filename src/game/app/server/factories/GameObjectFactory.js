const GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Position = require('../models/Position.js');
const GameObjectInfo = require('../utils/GameObjectInfo.js');


/**
 * The Game Object Service
 * @module GameObjectService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class GameObject {

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
     * @param {?Object} iFrameData iFrame data object if clicking this object opens an external website, otherwise undefined
     * @param {?String} iFrameData.title title of iFrame
     * @param {?String} iFrameData.url URL of iFrame
     * @param {?number} iFrameData.width width of iframe in px
     * @param {?number} iFrameData.height height of iframe in px
     * @param {?String[]} story Array of strings if clicking this
     *                          displays a text message, otherwise
     *                          undefined
     */
    #checkParamTypes = function (roomId, width, length, xPos, yPos, solidity, clickable, iFrameData, story) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isBoolean(solidity);
        TypeChecker.isBoolean(clickable);

        if (iFrameData !== undefined) {
            TypeChecker.isInstanceOf(iFrameData, Object);
            TypeChecker.isString(iFrameData.title);
            TypeChecker.isInt(iFrameData.width);
            TypeChecker.isInt(iFrameData.height);
            TypeChecker.isString(iFrameData.url);
        }

        if (story !== undefined) {
            TypeChecker.isInstanceOf(story, Array);
            story.forEach(element => TypeChecker.isString(element));
        }
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

    /**
     * Creates a custom instance of te GameObjectClass with no hard-coded
     * parameters passed.
     *
     * @method module:GameObjectService#createCustomObject
     * 
     * @param {String} roomId 
     * @param {String} type 
     * @param {Int} xPos 
     * @param {Int} yPos 
     * @param {Boolean} isSolid 
     * @param {Boolean} isClickable 
     * @param {?Object} iFrameData iFrame data object if clicking this object opens an external website, otherwise undefined
     * @param {?String} iFrameData.title title of iFrame
     * @param {?String} iFrameData.url URL of iFrame
     * @param {?number} iFrameData.width width of iframe in px
     * @param {?number} iFrameData.height height of iframe in px
     * @param {?String[]} story Array of strings if clicking this
     *                          displays a text message, otherwise
     *                          undefined
     * 
     * @returns {GameObject} A custom instance of the GameObject class
     */
    createCustomObject(roomId, type, xPos, yPos, isClickable, iFrameData, story) {
        this.#isKnownType(type);
        // only need to check the actually passed arguments
        this.#checkParamTypes(roomId, 0, 0, xPos, yPos, true, isClickable, iFrameData, story);
        
        return new GameObject(
            this.#generateGameObjectID(), 
            type, 
            GameObjectInfo.getInfo(type, "assetName"), 
            GameObjectInfo.getInfo(type, "width"), 
            GameObjectInfo.getInfo(type, "length"), 
            new Position(roomId, xPos, yPos), 
            GameObjectInfo.getInfo(type, "isSolid"), 
            isClickable, 
            iFrameData,
            story);
    }

    /**
     * A slight variation of the above class that allows for variations of
     * objects to be created. This could probably be done more elegantly.
     * 
     * @method module:GameObjectService#createObjectVariation
     * 
     * @param {String} roomId 
     * @param {String} type 
     * @param {Int} xPos 
     * @param {Int} yPos 
     * @param {Boolean} isSolid 
     * @param {Boolean} isClickable 
     * @param {?Object} iFrameData iFrame data object if clicking this object opens an external website, otherwise undefined
     * @param {?String} iFrameData.title title of iFrame
     * @param {?String} iFrameData.url URL of iFrame
     * @param {?number} iFrameData.width width of iframe in px
     * @param {?number} iFrameData.height height of iframe in px
     * @param {?String[]} story Array of strings if clicking this
     *                          displays a text message, otherwise
     *                          undefined
     * @param {Int} variation The variation of the object that is supposed to be created
     * 
     * @return {GameObject} A custom instance of the GameObject class
     */
    createObjectVariation(roomId, type, xPos, yPos, isClickable, iFrameData, story, variation) {
        this.#isKnownType(type);
        TypeChecker.isInt(variation);
        // only need to check the actually passed arguments
        this.#checkParamTypes(roomId, 0, 0, xPos, yPos, true, isClickable, iFrameData, story);
        
        return new GameObject(
            this.#generateGameObjectID(), 
            type, 
            GameObjectInfo.getInfo(type, "assetName")[variation], 
            GameObjectInfo.getInfo(type, "width"), 
            GameObjectInfo.getInfo(type, "length"), 
            new Position(roomId, xPos, yPos), 
            GameObjectInfo.getInfo(type, "isSolid"), 
            isClickable, 
            iFrameData,
            story);       
    }

    /**
     * A slight variation of the above method that allows to create
     * objects that consist out of more than one part
     * 
     * @method module:GameObjectService#createObjectPart
     * 
     * @param {String} roomId 
     * @param {String} type 
     * @param {Int} xPos 
     * @param {Int} yPos 
     * @param {Boolean} isSolid 
     * @param {Boolean} isClickable 
     * @param {?Object} iFrameData iFrame data object if clicking this object opens an external website, otherwise undefined
     * @param {?String} iFrameData.title title of iFrame
     * @param {?String} iFrameData.url URL of iFrame
     * @param {?number} iFrameData.width width of iframe in px
     * @param {?number} iFrameData.height height of iframe in px
     * @param {?String[]} story Array of strings if clicking this
     *                          displays a text message, otherwise
     *                          undefined
     * @param {Array[number]} part The part of the object that is supposed to be created
     * 
     * @return {GameObject} A custom instance of the GameObject class
     */
     createObjectPart(roomId, type, xPos, yPos, isClickable, iFrameData, story, part) {
        this.#isKnownType(type);
        TypeChecker.isInt(part.x);
        TypeChecker.isInt(part.y);
        // only need to check the actually passed arguments
        this.#checkParamTypes(roomId, 0, 0, xPos, yPos, true, isClickable, iFrameData, story);

        return new GameObject(
            this.#generateGameObjectID(),
            type, 
            GameObjectInfo.getInfo(type, "assetName")[part.x][part.y], 
            GameObjectInfo.getInfo(type, "width"), 
            GameObjectInfo.getInfo(type, "length"), 
            new Position(roomId, xPos, yPos), 
            GameObjectInfo.getInfo(type, "isSolid"), 
            isClickable, 
            iFrameData,
            story);        
    }


}