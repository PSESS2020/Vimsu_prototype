/**
 * The Room Decorator Model
 * @module RoomDecorator
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class RoomDecorator {

    /**
     * Abstract RoomDecorator class.
     * @abstract @constructor module:RoomDecorator
     */
    constructor() {
        if (new.target === RoomDecorator) {
            throw new Error("Cannot construct abstract RoomDecorator instances directly");
        }
    }
}
