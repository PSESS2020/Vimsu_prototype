const GameObject = require('../mapobjects/GameObject.js');
const TypeChecker = require('../../../client/shared/TypeChecker.js');
const GameObjectType = require('../../../client/shared/GameObjectType.js');
const Position = require('../Position.js');
const GameObjectInfo = require('../../utils/GameObjectInfo.js');
const GlobalStrings = require('../../../client/shared/GlobalStrings.js');


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
     * @method module:GameObjectFactory#createGameObject
     * 
     * The onClickData contains information about what is supposed to happen
     * when the object is clicked. It can be either an iFrameData object, an
     * array of strings (so a story) or a set of meeting data.
     * 
     * @param {String} roomId 
     * @param { { type:         GameObjectType, 
     *            position:     int[2],
     *            ?variation:   String,
     *            ?isClickable: Boolean,
     *            ?onClickData: Object,
     *            ?width:       int,
     *            ?length:      int,
     *            ?isSolid:     Boolean,
     *            ?assetSet:    String[] OR String[][] } } objData
     * 
     * @returns {GameObject[]} An array containing all parts making up the
     *                         object defined by the passed data 
     */
    createGameObject (roomId, objData) {
        // TODO type-checking
        
        // Destructuring the object for easier reference and a more flexible
        // method. The last two lines don't need to be separate, it's just
        // to signify that these are two different "levels" of customization.
        const { type, position: [xPos, yPos] }           = objData  // mandatory
        var { variation, isClickable, onClickData }      = objData  // optional
        var { width, length, isSolid, assetSet, offset } = objData  // custom
        
        let returnData = []

        if (isClickable === undefined) {
            isClickable = false
            // maybe delete onClickData here
        }

        if (variation === undefined) { variation = GlobalStrings.DEFAULT }
        
        // TODO this might cause additional parts to visually clash with
        //      the rest of the object if a custom assetSet has been
        //      defined
        if (GameObjectInfo.hasProperty(type, "parts")) {
            let parts = GameObjectInfo.getInfo(type, "parts")
            parts.forEach( partData => {
                const { type, offset_x, offset_y, variation } = partData
                this.createGameObject(roomId, { type, position: [ xPos + offset_x, yPos + offset_y ], isClickable, onClickData, variation }).forEach(elem => returnData.push(elem))
            })
        }

        // Check if custom options have been passed. If not, load default
        // ones from GameObjectInfo.
        if (width    === undefined) { width    = GameObjectInfo.getInfo(type, "width") }
        if (length   === undefined) { length   = GameObjectInfo.getInfo(type, "length") }
        if (isSolid  === undefined) { isSolid  = GameObjectInfo.getInfo(type, "isSolid") }
        if (assetSet === undefined) { assetSet = GameObjectInfo.getAsset(type, variation) }
        if (offset   === undefined) { offset   = GameObjectInfo.getOffset(type, variation) }
        
        let i = 0
        let isOffsetArray = Array.isArray(offset)
        assetSet.forEach(assetLinePart => {
            let isOffsetItemArray = (isOffsetArray) ? (Array.isArray(offset[i])) : false
            if (assetLinePart instanceof Array) {
                let j = 0
                assetLinePart.forEach(assetColPart => {
                    let partOffset = (isOffsetArray) ? ((isOffsetItemArray) ? offset[i][j] : offset[i]) : offset
                    returnData.push(new GameObject(this.#generateGameObjectID(),type, assetColPart, partOffset, width, length, new Position(roomId, xPos + i, yPos + j), isSolid, isClickable, onClickData))
                    j++
                })
            } else {
                let partOffset = (isOffsetArray) ? offset[i] : offset
                returnData.push(new GameObject(this.#generateGameObjectID(),type, assetLinePart, partOffset, width, length, new Position(roomId, xPos + i, yPos), isSolid, isClickable, onClickData))
            }
            i++
        })

        return returnData
    }

}