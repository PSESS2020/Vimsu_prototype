const OnClickDataParent = require("./OnClickDataParent");
const TypeOfOnClickData  = require("../../../client/shared/TypeOfOnClickData");
const Settings = require("../../utils/Settings");
const ObjectId = require('mongodb').ObjectID;
const TypeChecker = require("../../../client/shared/TypeChecker");

/**
 * @module OnClickMeetingData
 * 
 * NOTE: The meetings described by OnClickMeetingData objects are NOT kept
 *       in the database, so they're not guaranteed to be persistent or
 *       consistent. This is so they won't show up in the MeetingList.
 *       But it might be a good idea to change this later.
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class OnClickMeetingData extends OnClickDataParent {

    #id
    #name
    #domain
    #password

    /**
     * @constructor module:OnClickMeetingData
     * 
     * @param {String} name
     * @param {?String} domain
     */
    constructor(name, domain) {
        super()
        TypeChecker.isString(name)
        if (domain !== undefinded) { TypeChecker.isString(domain) }
        
        this.#id = new ObjectId().toHexString()
        this.#name = name
        this.#domain = (domain === undefined) ? Settings.DEFAULT_MEETINGDOMAIN : domain
        this.#password = new ObjectId().toHexString()
    }

    /**
     * @method module:OnClickMeetingData#getData
     * 
     * @return {Object} the data needed to properly create
     *                  the correct view class
     */
    getData() {
        return {
            type: TypeOfOnClickData.MEETING,
            id: this.#id,
            name: this.#name,
            domain: this.#domain,
            password: this.#password
        }
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickMeetingData
}