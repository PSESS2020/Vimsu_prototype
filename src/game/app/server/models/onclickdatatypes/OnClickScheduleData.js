const OnClickData = require("./OnClickData");
const TypeOfOnClickData  = require("../../../client/shared/TypeOfOnClickData")

/**
 * @module OnClickScheduleData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class OnClickScheduleData extends OnClickData {

    /**
     * 
     */
    constructor() {

    }

    /** */
    getData() {
        return {
            type: TypeOfOnClickData.SCHEDULE,
            
        }
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickScheduleData
}