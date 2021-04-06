// TODO:
// This will be a file where all npcs dialog is stored
// this should also allow for easier translation
// maybe move it into the shared folder

/**
 * @enum NPC dialog file
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 const NPCDialog = Object.freeze({
    foyerHelperDialog: ['Hey! Welcome to our Foyer!',
        'The door to my left leads to the lectures. Take a look and have fun! If you are on time and stay till the end, you can ask questions to the orator through the lecture chat.',
        'Enjoy your stay!'],
    basicTutorialDialog: ['Hello and welcome to this conference hosted by VIMSU!',
        'I would like to give you a short introduction with some basic tips.',
        'You can move around using WASD, arrow keys or by double-clicking the tile you want to move to.',
        'You can enter a room by clicking the door tile or running against the door. You need to be in range to enter a door.',
        'The door in this room leads you to the Foyer. From there, you can go anywhere and visit lectures!',
        'Keep in mind: you can interact with other participants by clicking the tile they are standing on.',
        'Earn points by visiting lectures, interacting with others or by reaching achievements!',
        'You can see the current points standings by clicking the Ranklist Button.',
        "Almost all buttons have a description. If you don't understand what a button does, just hover your mouse over the button and wait for the description to appear.",
        'There are other NPCs at this conference who would like to help you. You can recognize them by the red bar above them.',
        "That's it for now! Have fun and enjoy your stay!"],
    chefDialog: ['Hello mate. Are you hungry?',
        'Come back later to eat some of my fresh food!'],

});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NPCDialog;
}