const TypeOfOnClickData = require("../../../client/shared/TypeOfOnClickData")
const OnClickDataParent = require("./OnClickDataParent")

/**
 * The OnClickEmptyData Model
 * Only exists for more consistent behaviour.
 * @module OnClickEmptyData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class OnClickEmptyData extends OnClickDataParent{
    /**
     * @constructor module:OnCLickEmptyData
     */
    constructor() { super() }

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