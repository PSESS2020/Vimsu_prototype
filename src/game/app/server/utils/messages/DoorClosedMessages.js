/**
 * Messages that will be emitted when a user tries to enter a closed door
 * @module DoorClosedMessages
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 module.exports = Object.freeze({
    STANDARDDOORCLOSED: {
        header: "Door closed",
        body: "This door is currently closed for you."
    },
    FIRSTDOORCLOSED: {
        header: 'Welcome to VIMSU!',
        body: "Please talk to our BasicTutorial NPC by clicking" +
               " the tile he is standing on. He will give you a" +
               " short introduction that will help you to learn the basics of using VIMSU."
    },
    FOODCOURTDOORCLOSED: {
        header: "Door closed",
        body: "Greet our Chef before you leave!"
    }
});