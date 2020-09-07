/**
 * The Command Context Model
 * @module CommandContext
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class CommandContext {

    /**
     * Abstract CommandContext class.
     * @abstract @constructor module:CommandContext
     * This offers an interface usable by the commandHandler-class for better command abstraction.
     */
    constructor() {
        if (new.target === CommandContext) {
            throw new Error("Cannot construct abstract Context instances directly");
        }
    }

    /**
     * @method module:CommandContext#getMessages
     * 
     * @abstract gets messages in this context
     */
    getMessages() {
        throw new Error('getMessages() has to be implemented!');
    };

    /**
     * @method module:CommandContext#getTitle
     * 
     * @abstract title of this context
     */
    getTitle() {
        throw new Error('getTitle() has to be implemented!');
    };

    /**
     * @method module:CommandContext#updateMessages
     * 
     * @abstract messages in this context
     */
    updateMessages() {
        throw new Error('updateMessages() has to be implemented!');
    };

    /**
     * @method module:CommandContext#removeUser
     * 
     * @abstract participant from this context
     */
    removeUser() {
        throw new Error('removeUser() has to be implemented!');
    };

    /**
     * @method module:CommandContext#muteUser
     * 
     * @abstract participant from this context
     */
    muteUser() {
        throw new Error('muteUser() has to be implemented!');
    };

    /**
     * @method module:CommandContext#unmuteUser
     * 
     * @abstract unmutes participant from this context
     */
    unmuteUser() {
        throw new Error('unmuteUser() has to be implemented!');
    };

}
