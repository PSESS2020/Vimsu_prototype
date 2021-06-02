const GameObject = require('../mapobjects/GameObject.js');
const GameObjectType = require('../../../client/shared/GameObjectType.js');
const Position = require('../Position.js');
const GameObjectInfo = require('../../utils/GameObjectInfo.js');
const GlobalStrings = require('../../../client/shared/GlobalStrings.js');
const OnClickEmptyData = require('../onclickdatatypes/OnClickEmptyData.js');
const OnClickIFrameData = require('../onclickdatatypes/OnClickIFrameData.js');
const TypeOfOnClickData = require('../../../client/shared/TypeOfOnClickData.js');
const OnClickMeetingData = require('../onclickdatatypes/OnClickMeetingData.js');
const TypeChecker = require('../../../client/shared/TypeChecker.js');
const OnClickScheduleData = require('../onclickdatatypes/OnClickScheduleData.js');
const OnClickDataConstructors = require('../../utils/OnClickDataConstructors.js');
const Settings = require('../../utils/Settings.js');

/**
 * The Game Object Factory
 * @module GameObjectFactory
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameObjectFactory {

    #gameObjectIDs;

    constructor() {
        if (!!GameObjectFactory.instance) {
            return GameObjectFactoryinstance;
        }

        GameObjectFactory.instance = this;
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

    #onClickDataAlternateMode = function (objData) {
        for (var onClickType of Object.values(TypeOfOnClickData)) {
            if (objData.hasOwnProperty(onClickType)) {
                let data = objData[onClickType]
                return OnClickDataConstructors[onClickType](data) 
            }
        }
        return new OnClickEmptyData()
    }

    /**
     * @method module:GameObjectFactory#createGameObject
     * 
     * WARNING: May exhibit unexpected behaviour, as it always returns
     *          an array of GameObject instances, even when it created
     *          only one. 
     *          I'll get around to fixing this when I have the time.
     * 
     * The onClickData contains information about what is supposed to happen
     * when the object is clicked. It can be either an instance of a subclass
     * of the OnClickDataParent class or an object defining such an instance
     * according to the rules laid out in the Floorplan example.
     * 
     * @param {String} roomId 
     * @param { { type:         GameObjectType, 
     *            position:     int[2],
     *            ?variation:   String,
     *            ?isClickable: Boolean,
     *            ?onClickData: Object OR OnClickDataParent,
     *            ?width:       int,
     *            ?length:      int,
     *            ?isSolid:     Boolean,
     *            ?assetSet:    String[] OR String[][] } } objData
     * 
     * @returns {GameObject[]} An array containing all parts making up the
     *                         object defined by the passed data 
     */
    createGameObject (roomId, objData) {
        // Destructuring the object for easier reference and a more flexible
        // method. The last two lines don't need to be separate, it's just
        // to signify that these are two different "levels" of customization.
        const { type, position: [xPos, yPos] }           = objData  // mandatory
        var { variation, isClickable, onClickData }      = objData  // optional
        var { width, length, isSolid, assetSet, offset } = objData  // custom

        if (!GameObjectInfo.isKnownObject(type)) {
            throw new TypeError(`${type} is not a known type of object!`)
        }
        
        let returnData = []

        if (isClickable === undefined) { isClickable = false }
        if (onClickData === undefined) {
            onClickData = ((isClickable) ? this.#onClickDataAlternateMode(objData) : new OnClickEmptyData())
            if (onClickData instanceof OnClickEmptyData) { isClickable = false }
        }

        if (onClickData instanceof OnClickScheduleData && !Settings.VIDEOSTORAGE_ACTIVATED) {
            throw new Error("You added an object to the floorplan that was supposed to open the schedule when clicked, but video storage isn't activated for this conference.")
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
        if (width    === undefined) { width    = GameObjectInfo.getInfo(type, "width")   }
        if (length   === undefined) { length   = GameObjectInfo.getInfo(type, "length")  }
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

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectFactory;
}