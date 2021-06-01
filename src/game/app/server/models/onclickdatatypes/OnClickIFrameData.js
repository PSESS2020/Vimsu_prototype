const OnClickData = require("./OnClickData");
const TypeOfOnClickData  = require("../../../client/shared/TypeOfOnClickData");
const TypeChecker = require("../../../client/shared/TypeChecker");

/**
 * @module OnClickIFrameData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class OnClickIFrameData extends OnClickData {

    #title
    #width
    #height
    #url

    /**
     * @constructor module:OnClickIFrameData
     * 
     * @param {String} title  the title of the iFrame
     * @param {Number} width  the width of the iFrame
     * @param {Number} height the height of the iFrame
     * @param {String} url    the url of the site displayed inside
     *                        the iFrame
     */
    constructor(title, width, height, url) {
        TypeChecker.isString(title)
        TypeChecker.isIntAboveZero(width)
        TypeChecker.isIntAboveZero(height)
        TypeChecker.isString(url)

        this.#title  = title
        this.#width  = width
        this.#height = height
        this.#url    = url
    }

    /**
     * @method module:OnClickIFrameData#getData
     * 
     * @return {Object} the data needed to properly create
     *                  the correct view class
     */
    getData() {
        return Object.freeze({ type: TypeOfOnClickData.IFRAME })
    }

    /**
     * @method module:OnClickIFrameData#getIFrameData
     * 
     * @return {Object} The data needed to properly display the iFrame
     */
    getIFrameData() {
        return Object.freeze({
            title:  this.#title,
            width:  this.#width,
            height: this.#height,
            url:    this.#url
        })
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickIFrameData
}