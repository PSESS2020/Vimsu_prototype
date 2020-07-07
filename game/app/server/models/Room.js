var TypeChecker = require('../../client/utils/TypeChecker.js');
var TypeOfRoom = require('./TypeOfRoom.js');
var RoomController = require('../controller/RoomController.js');
var GameObject = require('./GameObject.js');
var Participant = require('./Participant.js');
var GameObjectService = require('../services/GameObjectService.js');
var RoomDimensions = require('./RoomDimensions.js');

module.exports = class Room {

    #roomId;
    //roomController;
    //roomChat
    #length;
    #width;
    #listOfPPants;
    #occupationMap;
    //listOfNPCs
    #listOfGameObjects;
    //listOfDoors;

    /**
     * Erstellt Rauminstanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoom} typeOfRoom 
     */
    constructor(roomId, typeOfRoom) {
        TypeChecker.isInt(roomId);
        //TypeChecker.isInstanceOf(roomController, RoomController);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        this.#roomId = roomId;
        //this.#roomController = roomController;
        this.#listOfPPants = [];

        //andere Fälle später
        if (typeOfRoom == "FOYER") {
            
            
            this.#length = RoomDimensions.FOYER_LENGTH;
            this.#width = RoomDimensions.FOYER_WIDTH;

            //Initialisiert width*length Feld gefüllt mit 0
            this.#occupationMap = new Array(this.#width);
            var i;
            for (i = 0; i < this.#width; i++) {
                this.#occupationMap[i] = new Array(this.#length).fill(0);
            }
            
            //Alle GameObjekte die in diesen Raum gehören von Service holen

            let objService = new GameObjectService(this.#roomId, this.#width, this.#length);
            this.#listOfGameObjects = objService.getObjects(this.#roomId);

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
            
        }
    }

    getRoomId() {
        return this.#roomId;
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
    exitParticipant(participant) {
        TypeChecker.isInstanceOf(participant, Participant);
        if (this.#listOfPPants.includes(participant)) {
            let index = this.#listOfPPants.indexOf(participant);
            this.#listOfPPants.splice(index, 1);
        }

        //TODO: Entfernen aus Allchat
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

     /*
    checkForCollision(position) {
        TypeChecker.isInstanceOf(position, Position);
        let cordX = position.getCordX();
        let cordY = position.getCordY();

        if (this.#occupationMap[cordX][cordY] == 1) {
            return true;
        }
        else {
            return false;
        }
    }
    */
}
