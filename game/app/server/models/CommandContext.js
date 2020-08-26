/* This offers an interface usable by the commandHandler-class for better command abstraction */
// Do this as an abstract class extended by LectureContext, RoomContext etc.
module.exports = class CommandContext {
    
    constructor() {
        if (new.target === CommandContext) {
            throw new Error("Cannot construct abstract Context instances directly");
        }
    }
    
    getMessages() {
        throw new Error('getMessages() has to be implemented!');
    };
    
    getTitle() {
        throw new Error('getTitle() has to be implemented!');
    };
    
    updateMessages() {
        throw new Error('updateMessages() has to be implemented!');
    };
    
    removeUser() {
        throw new Error('removeUser() has to be implemented!');
    };
    
    muteUser() {
        throw new Error('muteUser() has to be implemented!');
    };
    
    unmuteUser() {
        throw new Error('unmuteUser() has to be implemented!');
    };
    
}
