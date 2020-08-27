const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const GameObject = require('./GameObject.js');
const Participant = require('./Participant.js');
const Position = require('./Position.js');
const Door = require('./Door.js');
const NPC = require('./NPC.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');

/**
 * The Room Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Room {

    #roomId;
    #typeOfRoom;
    #length;
    #width;
    #listOfPPants;
    #occupationMap;
    #listOfGameObjects;
    #listOfNPCs;
    #listOfDoors;
    #listOfMessages;
    #listOfMapElements;

    /**
     * @constructor Creates a Room instance
     * 
     * @param {number} roomId room ID
     * @param {TypeOfRoom} typeOfRoom type of room
     * @param {number} width room width
     * @param {number} length room length
     */
    constructor(roomId, typeOfRoom, width, length) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        this.#listOfPPants = [];
        this.#listOfMessages = [];

        //Assigned in decorator of room
        this.#listOfNPCs = [];
        this.#listOfGameObjects = [];
        this.#listOfDoors = [];
        this.#listOfMapElements = [];

        this.#length = length;
        this.#width = width;

        //Initialized with width*length Array full of 0
        this.#occupationMap = new Array(this.#width);
        for (var i = 0; i < this.#width; i++) {
            this.#occupationMap[i] = new Array(this.#length).fill(0);
        }
    }

    /**
     * Sets map elements
     * 
     * @param {GameObject[]} lisOfMapElements list of map elements
     */
    setMapElements(lisOfMapElements) {
        TypeChecker.isInstanceOf(lisOfMapElements, Array);
        lisOfMapElements.forEach(mapElement => {
            TypeChecker.isInstanceOf(mapElement, GameObject);
        });

        this.#listOfMapElements = lisOfMapElements;
    }

    /**
     * Sets game objects
     * 
     * @param {GameObject[]} listOfGameObjects list of game objects
     */
    setGameObjects(listOfGameObjects) {
        TypeChecker.isInstanceOf(listOfGameObjects, Array);
        listOfGameObjects.forEach(gameObject => {
            TypeChecker.isInstanceOf(gameObject, GameObject);
        });

        this.#listOfGameObjects = listOfGameObjects;
    }

    /**
     * Sets NPCs
     * 
     * @param {NPC[]} listOfNPCs list of NPCs
     */
    setNPCs(listOfNPCs) {
        TypeChecker.isInstanceOf(listOfNPCs, Array);
        listOfNPCs.forEach(npc => {
            TypeChecker.isInstanceOf(npc, NPC);
        });

        this.#listOfNPCs = listOfNPCs;
    }

    /**
     * Sets doors 
     * 
     * @param {Door[]} listOfDoors list of doors
     */
    setDoors(listOfDoors) {
        TypeChecker.isInstanceOf(listOfDoors, Array);
        listOfDoors.forEach(door => {
            TypeChecker.isInstanceOf(door, Door);
        });

        this.#listOfDoors = listOfDoors;
    }

    /**
     * Gets room ID
     * 
     * @return roomId
     */
    getRoomId() {
        return this.#roomId;
    }

    /**
     * Gets type of room
     * 
     * @return typeOfRoom
     */
    getTypeOfRoom() {
        return this.#typeOfRoom;
    }

    /**
     * Gets room chat messages
     * 
     * @return listOfMessages
     */
    getMessages() {
        return this.#listOfMessages;
    }

    /**
     * Gets room width
     * 
     * @return width
     */
    getWidth() {
        return this.#width;
    }

    /**
     * Gets room length
     * 
     * @return length
     */
    getLength() {
        return this.#length;
    }

    /**
     * Gets list of participants in the room
     * 
     * @return listOfPpants
     */
    getListOfPPants() {
        return this.#listOfPPants;
    }

    /**
     * Gets list of map elements
     * 
     * @return listOfMapElements
     */
    getListOfMapElements() {
        return this.#listOfMapElements;
    }

    /**
     * Gets list of game objects
     * 
     * @return listOfGameObjects
     */
    getListOfGameObjects() {
        return this.#listOfGameObjects;
    }

    /**
     * Gets list of NPCs
     * 
     * @return listOfNPCs
     */
    getListOfNPCs() {
        return this.#listOfNPCs;
    }

    /**
     * Gets list of doors
     * 
     * @return listOfDoors
     */
    getListOfDoors() {
        return this.#listOfDoors;
    }

    /**
     * Gets occupation map
     * 
     * @return occupationMap
     */
    getOccMap() {
        return this.#occupationMap;
    };

    /**
     * Gets a NPC with this id
     * 
     * @param {number} id NPC ID
     */
    getNPC(id) {
        TypeChecker.isInt(id);

        let index = this.#listOfNPCs.findIndex(npc => npc.getId() === id);

        if (index < 0) {
            return undefined;
        }

        return this.#listOfNPCs[index];
    }

    /**
     * Adds ppant into room
     * 
     * @param {Participant} participant participant
     */
    enterParticipant(participant) {
        TypeChecker.isInstanceOf(participant, Participant);
        if (!this.#listOfPPants.includes(participant)) {
            this.#listOfPPants.push(participant);
        }
    }

    /**
    * Deletes ppant from room
    * 
    * @param {Participant} participant participant
    */
    exitParticipant(participantId) {
        TypeChecker.isString(participantId);
        this.#listOfPPants.forEach(participant => {
            if (participant.getId() === participantId) {
                let index = this.#listOfPPants.indexOf(participant);
                this.#listOfPPants.splice(index, 1);
            }
        });

    }

    /**
     * Checks if ppant with ppantID is currently in this room
     * 
     * @param {String} ppantID participant ID
     */
    includesParticipant(ppantID) {
        TypeChecker.isString(ppantID);
        var returnValue = false;
        this.#listOfPPants.forEach(ppant => {
            if (ppant.getId() === ppantID) {
                returnValue = true;
            }
        });
        return returnValue;
    }

    /**
     * Get a participant who is currently in this room
     * 
     * @param {String} ppantID participant ID
     */
    getParticipant(ppantID) {
        TypeChecker.isString(ppantID);
        var result;
        this.#listOfPPants.forEach(ppant => {
            if (ppantID === ppant.getId()) {
                result = ppant;
            }
        });
        return result;
    }

    /**
     * Checks, if there is a collision at this position
     * 
     * @param {Position} position avatar position
     * @returns true, when collision
     * @returns false, otherwise
     */
    checkForCollision(position) {
        TypeChecker.isInstanceOf(position, Position);
        let cordX = position.getCordX();
        let cordY = position.getCordY();

        if (position.getRoomId() != this.#roomId) {
            throw new Error('Wrong room id!');
        }

        //WALLS
        if (cordX < 0 || cordY < 0 || cordX >= this.#width || cordY >= this.#length) {
            return true;
        }

        if (this.#occupationMap[cordX][cordY] == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Adds message to the room chat
     * 
     * @param {String} ppantID participant ID
     * @param {String} username participant username
     * @param {Date} date message timestamp
     * @param {String} text message text
     */
    addMessage(ppantID, username, date, text) {
        TypeChecker.isString(ppantID);
        TypeChecker.isString(username);
        TypeChecker.isDate(date);
        TypeChecker.isString(text);

        var message = { senderID: ppantID, messageID: this.#listOfMessages.length, username: username, timestamp: date, text: text };
        this.#listOfMessages.push(message);
    }

    /**
     * Builds occupation map. Array is occupied by 1 if there is a solid game object or a NPC in this position
     */
    buildOccMap() {
        //Goes through each gameObject
        for (var i = 0; i < this.#listOfGameObjects.length; i++) {

            //Check if object is solid or not
            if (this.#listOfGameObjects[i].getSolid()) {

                let objectPosition = this.#listOfGameObjects[i].getPosition();
                let objectWidth = this.#listOfGameObjects[i].getWidth();
                let objectLength = this.#listOfGameObjects[i].getLength();

                //Sets each field 1 with solid gameObject
                for (var j = objectPosition.getCordX(); j < objectPosition.getCordX() + objectWidth; j++) {

                    for (var k = objectPosition.getCordY(); k < objectPosition.getCordY() + objectLength; k++) {
                        this.#occupationMap[j][k] = 1;
                    }
                }
            }
        }

        //collision with NPCs
        for (var i = 0; i < this.#listOfNPCs.length; i++) {
            let npcPosition = this.#listOfNPCs[i].getPosition();
            let cordX = npcPosition.getCordX();
            let cordY = npcPosition.getCordY();
            this.#occupationMap[cordX][cordY] = 1;
        }
    }

    /**
     * Gets Door to room with roomId if it exists
     * 
     * @param {number} targetId target room ID
     * 
     * @return door
     */
    getDoorTo(targetId) {
        TypeChecker.isInt(targetId);
        for (var i = 0; i < this.#listOfDoors.length; i++) {
            if (this.#listOfDoors[i].getTargetRoomId() === targetId) {
                return this.#listOfDoors[i];
            }
        }
    }

    /**
     * Return Lecture Door if it exists in this room
     * 
     * @return lecture door
     */
    getLectureDoor() {
        if (this.#typeOfRoom !== TypeOfRoom.FOYER) {
            throw new Error('Lecture Door is only in FOYER!');
        }

        for (var i = 0; i < this.#listOfDoors.length; i++) {
            if (this.#listOfDoors[i].getTypeOfDoor() === TypeOfDoor.LECTURE_DOOR) {
                return this.#listOfDoors[i];
            }
        }
    }
}
