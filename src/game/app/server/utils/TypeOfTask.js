/**
 * Constants of type of task
 * @module TypeOfTask
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    VISIT: "VISIT", // Enter Lecture or Room
    IFRAME: "IFRAME", // Achievement that gets triggered on iFrame
    INTERACT: "INTERACT", // Interact with object or npc
    MAKEFRIEND: "MAKEFRIEND", // Make a friend
    TALK: "TALK", // send message in a chat

    // How to get task that only triggers on first chat message?

    RECEPTIONVISIT: "RECEPTIONVISIT",
    FOODCOURTVISIT: "FOODCOURTVISIT",
    BASICTUTORIALCLICK: "BASICTUTORIALCLICK",
    FOYERHELPERCLICK: "FOYERHELPERCLICK",
    CHEFCLICK: "CHEFCLICK",
    FOYERVISIT: "FOYERVISIT",
    LECTUREVISIT: "LECTUREVISIT",
    BEFRIENDOTHER: "BEFRIENDOTHER",
    INITPERSONALCHAT: "INITPERSONALCHAT",
    ASKQUESTIONINLECTURE: "ASKQUESTIONINLECTURE",
    SENDALLCHAT: "SENDALLCHAT" //for test purposes, not really used.
});
