module.exports = class RoomDecorator {
    constructor() {
        if (new.target === RoomDecorator) {
            throw new Error("Cannot construct abstract RoomDecorator instances directly");
        }
    }
}