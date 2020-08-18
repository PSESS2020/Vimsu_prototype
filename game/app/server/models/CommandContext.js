/* This offers an interface usable by the commandHandler-class for better command abstraction */
// Do this as an abstract class extended by LectureContext, RoomContext etc.
module.exports = class CommandContext {
    
    constructor() {
        if (new.target === CommandContext) {
            throw new Error("Cannot construct abstract Context instances directly");
        }
    }
    
    getMessages() {
        // abstract method stump to be implemented in child classes
    };
    
    getTitle() {
        // abstract method stump to be implemented in child classes
    };
    
    updateMessages() {
        // abstract method stump to be implemented in child classes
    };
    
    removerUser() {
        // abstract method stump to be implemented in child classes
    };
    
    muteUser() {
        // abstract method stump to be implemented in child classes
    };
    
    unmuteUser() {
        // abstract method stump to be implemented in child classes
    };
    
}
