/**
 * The OnClickData Model
 * Only exists for TypeChecking
 * @module OnClickData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class OnClickData {
    /**
     * @abstract abstract OnClickDatas class
     */
    constructor() {
        if (new.target === OnClickData) {
            throw new Error("Cannot construct abstract OnClickData  instances directly");
        }
    }

    /**
     * @abstract abstract getData method
     */
    getData() {
        throw new Error('getData() has to be implemented!');
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickData
}