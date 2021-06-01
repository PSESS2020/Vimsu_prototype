const TypeOfOnClickData = require("../../../client/shared/TypeOfOnClickData")
const OnClickData = require("./OnClickData")

/**
 * The OnClickEmptyData Model
 * Only exists for more consistent behaviour.
 * @module OnClickEmptyData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class OnClickEmptyData extends OnClickData{
    /**
     * @constructor module:OnCLickEmptyData
     */
    constructor() {}

    /**
     * @method module:onClickEmptyData#getData
     * 
     * @return {Object} data object signifying there is no
     *                  onClickData
     */
    getData() {
        return { type: TypeOfOnClickData.EMPTY }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickEmptyData
}