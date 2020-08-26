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