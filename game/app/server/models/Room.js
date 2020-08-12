const TypeChecker = require('../../client/shared/TypeChecker.js');
var TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
var RoomController = require('../controller/RoomController.js');
var GameObject = require('./GameObject.js');
var Participant = require('./Participant.js');
var GameObjectService = require('../services/GameObjectService.js');
const Position = require('./Position.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../../client/shared/Settings.js');
const Door = require('./Door.js');
const NPCService = require('../services/NPCService.js');
const NPC = require('./NPC.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');
const DoorService = require('../services/DoorService.js');

module.exports = class Room {

    #roomId;
    #typeOfRoom;
    //roomChat
    #length;
    #width;
    #listOfPPants;
    #occupationMap;
    //listOfNPCs
    #listOfGameObjects;
    #listOfNPCs;
    //listOfDoors;
    #listOfDoors; //TODO: Get right doors from service
    #listOfMessages; // instead of a seperate chat-class, we just have a list of messages for each room for now

    /**
     * Erstellt Rauminstanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoom} typeOfRoom 
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

        this.#length = length;
        this.#width = width;

        //Initialisiert width*length Feld gefüllt mit 0
        this.#occupationMap = new Array(this.#width);
        for (var i = 0; i < this.#width; i++) {
            this.#occupationMap[i] = new Array(this.#length).fill(0);
        }
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
    
    /*
    getRoomController() {
        return this.#roomController;
    }
    */

    getWidth() {
        return this.#width;
    }

    getLength() {
        return this.#length;
    }

    getListOfPPants() {
        return this.#listOfPPants;
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

    getNPC(id)
    {
        TypeChecker.isInt(id);

        let index = this.#listOfNPCs.findIndex(npc => npc.getId() === id);

        if (index < 0) 
        {
            throw new Error(id + " is not in list of npcs")
        }

        return this.#listOfNPCs[index];
    }

    /**
     * Fügt Participant in Raumliste ein, falls dieser noch nicht darin ist
     * 
     * @author Philipp
     * 
     * @param {Participant} participant 
     */
    enterParticipant(participant) {
        TypeChecker.isInstanceOf(participant, Participant);
        if (!this.#listOfPPants.includes(participant)) {
            this.#listOfPPants.push(participant);
        }

        //TODO: Einfügen in Allchat
    }

     /**
     * Entfernt Participant aus Raumliste, falls dieser darin ist
     * 
     * @author Philipp
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
     * Checkt, ob es auf der gelieferten Position zu einer Kollision kommt. 
     * 
     * @author Philipp
     * 
     * @param {Position} position 
     * @returns true, bei Kollision
     * @returns false, sonst
     */

     
    checkForCollision(position) {
        TypeChecker.isInstanceOf(position, Position);
        let cordX = position.getCordX();
        let cordY = position.getCordY();

        if(position.getRoomId() != this.#roomId) {
            throw new Error('Wrong room id!');
        }

        //WALLS
        if (cordX < 0 || cordY < 0 || cordX >= this.#width || cordY >= this.#length) {
            return true;
        }

        if (this.#occupationMap[cordX][cordY]  == 1) {
            return true;
        }
        else {
            return false;
        }
    }


    addMessage(ppantID, username, date, text) {

        var message = { senderID: ppantID, messageID: this.#listOfMessages.length, username: username, timestamp: date, text: text };
        this.#listOfMessages.push(message);
    }


   buildOccMap() {
        //Geht jedes Objekt in der Objektliste durch
        for (var i = 0; i < this.#listOfGameObjects.length; i++) {
            
            //Check ob Objekt fest ist oder nicht
            if (this.#listOfGameObjects[i].getSolid()) {

                let objectPosition = this.#listOfGameObjects[i].getPosition();
                let objectWidth = this.#listOfGameObjects[i].getWidth();
                let objectLength = this.#listOfGameObjects[i].getLength();

                //Jedes Feld, das festes Objekt bedeckt, auf 1 setzen
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
     * @author Philipp
     * 
     * @param {int} targetId 
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
