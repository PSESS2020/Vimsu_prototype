const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const GameObject = require('./GameObject.js');
const Participant = require('./Participant.js');
const Position = require('./Position.js');
const Door = require('./Door.js');
const NPC = require('./NPC.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');

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
    #listOfMessages; // instead of a seperate chat-class, we just have a list of messages for each room for now
    #listOfMapElements;

    /**
     * 
     * 
     * @param {number} roomId 
     * @param {TypeOfRoom} typeOfRoom 
     * @param {number} width
     * @param {number} length
     */
    constructor(roomId, typeOfRoom, width, length) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

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

    setMapElements(lisOfMapElements) {
        TypeChecker.isInstanceOf(lisOfMapElements, Array);
        lisOfMapElements.forEach(mapElement => {
            TypeChecker.isInstanceOf(mapElement, GameObject);
        });

        this.#listOfMapElements = lisOfMapElements;
    }

    setGameObjects(listOfGameObjects) {
        TypeChecker.isInstanceOf(listOfGameObjects, Array);
        listOfGameObjects.forEach(gameObject => {
            TypeChecker.isInstanceOf(gameObject, GameObject);
        });

        this.#listOfGameObjects = listOfGameObjects;
    }

    setNPCs(listOfNPCs) {
        TypeChecker.isInstanceOf(listOfNPCs, Array);
        listOfNPCs.forEach(npc => {
            TypeChecker.isInstanceOf(npc, NPC);
        });

        this.#listOfNPCs = listOfNPCs;
    }

    setDoors(listOfDoors) {
        TypeChecker.isInstanceOf(listOfDoors, Array);
        listOfDoors.forEach(door => {
            TypeChecker.isInstanceOf(door, Door);
        });

        this.#listOfDoors = listOfDoors;
    }

    getRoomId() {
        return this.#roomId;
    }

    getTypeOfRoom() {
        return this.#typeOfRoom;
    }

    getMessages() {
        return this.#listOfMessages;
    }

    getWidth() {
        return this.#width;
    }

    getLength() {
        return this.#length;
    }

    getListOfPPants() {
        return this.#listOfPPants;
    }

    getListOfMapElements() {
        return this.#listOfMapElements;
    }

    getListOfGameObjects() {
        return this.#listOfGameObjects;
    }

    getListOfNPCs() {
        return this.#listOfNPCs;
    }

    getListOfDoors() {
        return this.#listOfDoors;
    }

    getOccMap() {
        return this.#occupationMap;
    };

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
     * 
     * @param {Participant} participant 
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
    * 
    * @param {Participant} participant 
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

    //Checks if ppant with ppantID is currently in this room
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

    //Method to get a Participant who is currently in this room
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
     * 
     * @param {Position} position 
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


    addMessage(ppantID, username, date, text) {
        // change to message object?
        var message = { senderID: ppantID, messageID: this.#listOfMessages.length, username: username, timestamp: date, text: text };
        this.#listOfMessages.push(message);
    }


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
     * 
     * @param {number} targetId 
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
