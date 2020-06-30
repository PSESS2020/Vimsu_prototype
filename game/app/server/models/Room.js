var TypeChecker = require('../../utils/TypeChecker.js');
var TypeOfRoom = require('./TypeOfRoom.js');
const { FOYER } = require('./TypeOfRoom.js');
var RoomController = require('../controller/RoomController.js');
var GameObject = require('./GameObject.js');

module.exports = class Room {

    #roomId;
    #roomController;
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
     * @param {RoomController} roomController
     * @param {TypeOfRoom} typeOfRoom 
     */
    constructor(roomId, roomController, typeOfRoom) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInstanceOf(roomController, RoomController);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        this.#roomId = roomId;
        this.#roomController = roomController;
        this.#listOfPPants = [];
        
        //Initialisiert width*length Feld gefüllt mit 0
        this.#occupationMap = new Array(width);
        for (i = 0; i < width; i++) {
            this.#occupationMap[i] = new Array(length).fill(0);
        }

        //anderen Fälle später
        if (typeOfRoom == FOYER) {
            
            //random Werte
            this.#length = 100;
            this.#width = 100;
            
            //Alle GameObjekte die in diesen Raum gehören instanziieren und in Liste einfügen

            //this.#listOfGameObjects.push(new GameObject());
            //this.#listOfGameObjects.push(new GameObject());
            //this.#listOfGameObjects.push(new GameObject());


            //Geht jedes Objekt in der Objektliste durch
            for (i = 0; i < this.#listOfGameObjects.length; i++) {
                let objectPosition = this.#listOfGameObjects[i].getPosition();
                let objectWidth = this.#listOfGameObjects.getWidth();
                let objectLength = this.#listOfGameObjects.getLength();

                //Jedes Feld, das Objekt bedeckt, auf 1 setzen
                for (j = objectPosition.getCordX(); j <= objectPosition.getCordX + objectWidth; j++) {
                    for (k = objectPosition.getCordY(); k <= objectPosition.getCordY + objectLength; k++) {
                        this.#occupationMap[j][k] = 1;
                           
                    }
                }
            }
        }
    }
}