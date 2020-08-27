/**
 * The Room Decorator Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class RoomDecorator {

    /**
     * @constructor @abstract abstract RoomDecorator class
     */
    constructor() {
        if (new.target === RoomDecorator) {
            throw new Error("Cannot construct abstract RoomDecorator instances directly");
        }
    }
}