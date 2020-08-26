module.exports = class CommandContext {
    
    /**
     * @abstract @constructor abstract CommandContext class.
     * This offers an interface usable by the commandHandler-class for better command abstraction.
     */
    constructor() {
        if (new.target === CommandContext) {
            throw new Error("Cannot construct abstract Context instances directly");
        }
    }
    
    /**
     * @abstract gets messages in this context
     */
    getMessages() {
        throw new Error('getMessages() has to be implemented!');
    };
    
    /**
     * @abstract gets title of this context
     */
    getTitle() {
        throw new Error('getTitle() has to be implemented!');
    };
    
    /**
     * @abstract updates messages in this context
     */
    updateMessages() {
        throw new Error('updateMessages() has to be implemented!');
    };
    
    /**
     * @abstract removes participant from this context
     */
    removeUser() {
        throw new Error('removeUser() has to be implemented!');
    };
    
    /**
     * @abstract mutes participant from this context
     */
    muteUser() {
        throw new Error('muteUser() has to be implemented!');
    };
    
    /**
     * @abstract unmutes participant from this context
     */
    unmuteUser() {
        throw new Error('unmuteUser() has to be implemented!');
    };
    
}
