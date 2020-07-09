//var TypeChecker = require('../../utils/TypeChecker.js');
//var ParticipantClient = require('./ParticipantClient.js');


/*module.exports = */class RoomClient {

    #roomId;
    //clientRoomChat
    #typeOfRoom;
    #length;
    #width;
    #listOfPPants;
    //#occupationMap;
    //listOfNPCs
    #listOfGameObjects = [];
    //listOfDoors
    #map;
    
    /**
     * Erzeugt RoomClient Instanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoomClient} typeOfRoom
     * @param {Array of ParticipantClient} listOfPPants 
     */
    constructor(roomId, typeOfRoom, listOfPPants) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoomClient);
        TypeChecker.isInstanceOf(listOfPPants, Array);

        listOfPPants.forEach(element => {
            TypeChecker.isInstanceOf(element, ParticipantClient);
        });

        //Es existiert nur RoomClientInstanz des Raumes, in dem sich der Teilnehmer gerade befindet
        if (!!RoomClient.instance) {
            return RoomClient.instance;
        }

        RoomClient.instance = this;

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        this.#listOfPPants = listOfPPants;
        //this.#occupationMap = occupationMap;
        //this.buildMapArray();

        if (this.#typeOfRoom === "FOYER") {
            this.#width = RoomDimensionsClient.FOYER_WIDTH;
            this.#length = RoomDimensionsClient.FOYER_LENGTH;

            this.#listOfGameObjects.push(new GameObjectClient(1, "table", 1, 1, new PositionClient(4, 0), true));
            this.#listOfGameObjects.push(new GameObjectClient(1, "table", 1, 1, new PositionClient(5, 0), true));
            this.#listOfGameObjects.push(new GameObjectClient(1, "table", 1, 1, new PositionClient(6, 0), true));
            this.#listOfGameObjects.push(new GameObjectClient(1, "table", 1, 1, new PositionClient(7, 0), true));
            this.#listOfGameObjects.push(new GameObjectClient(1, "table", 1, 1, new PositionClient(8, 0), true));
        }

        //Initialisiert width*length Feld gefüllt mit 0
        this.#occupationMap = new Array(this.#width);
        for (var i = 0; i < this.#width; i++) {
            this.#occupationMap[i] = new Array(this.#length).fill(0);
        }

        this.#buildOccMap();
        this.buildMapArray();
    }

    getRoomId() {
        return this.#roomId;
    }

    getTypeOfRoom() {
        return this.#typeOfRoom;
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

    getListOfGameObjects() {
        return this.#listOfGameObjects;
    }

    /**
     * Fügt Participant in Raumliste ein, falls dieser noch nicht darin ist
     * 
     * @author Philipp
     * 
     * @param {ParticipantClient} participant 
     */
    enterParticipant(participant) {
        TypeChecker.isInstanceOf(participant, ParticipantClient);
        if (!this.#listOfPPants.includes(participant)) {
            this.#listOfPPants.push(participant);
        }
    }

    /**
     * Entfernt Participant aus Raumliste, falls dieser darin ist
     * 
     * @author Philipp
     * 
     * @param {ParticipantClient} participant 
     */
    exitParticipant(participant) {
        TypeChecker.isInstanceOf(participant, ParticipantClient);
        if (this.#listOfPPants.includes(participant)) {
            let index = this.#listOfPPants.indexOf(participant);
            this.#listOfPPants.splice(index, 1);
        }
    }

    /**
     * Checkt, ob es auf der gelieferten Position zu einer Kollision kommt. 
     * 
     * @author Philipp
     * 
     * @param {PositionClient} position 
     * @returns true, bei Kollision
     * @returns false, sonst
     */
    checkForCollision(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        let cordX = position.getCordX();
        let cordY = position.getCordY();

        //WALLS
        if (cordX < 0 || cordY < 0 || cordX >= this.#width || cordY >= this.#length) {
            return true;
        }
    
        //GAMEOBJECTS in room
        if (this.#occupationMap[cordX][cordY] == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Wird bei Raumwechsel aufgerufen
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoomClient} typeOfRoom
     * @param {int} length 
     * @param {int} width 
     * @param {Array of ParticipantClient} listOfPPants 
     * @param {Array of Array of int} occupationMap 
     */
    swapRoom(roomId, typeOfRoom, length, width, listOfPPants, listOfGameObjects) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoomClient);
        TypeChecker.isInt(length);
        TypeChecker.isInt(width);
        TypeChecker.isInstanceOf(listOfPPants, Array);
        TypeChecker.isInstanceOf(listOfGameObjects, Array);

        listOfPPants.forEach(element => {
            TypeChecker.isInstanceOf(element, ParticipantClient);
        });

        listOfGameObjects.forEach(element => {
            TypeChecker.isInstanceOf(element, GameObjectClient);
        });


        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        this.#length = length;
        this.#width = width;
        this.#listOfPPants = listOfPPants;
        this.#listOfGameObjects = listOfGameObjects;
        this.#buildOccMap();
        //this.#occupationMap = occupationMap;
        this.buildMapArray();
    }

    buildMapArray() {

        //force minimal room sizes for foyer
        if (this.#typeOfRoom == "FOYER") {
            if (this.#width < 6) {
                this.#width = 5;
            }

            if (this.#length < 8) {
                this.#length = 7;
            }
        }

        var mapLength = this.#width + 2;
        this.#map = new Array(mapLength);

        for (var i = 0; i < mapLength; i++) {
            this.#map[i] = new Array(this.#length + 2).fill(GameObjectTypeClient.TILE);
        }

        for (var i = 0; i < mapLength; i++) {
            this.#map[i][0] = GameObjectTypeClient.BLANK;
            this.#map[mapLength - 1][i] = GameObjectTypeClient.BLANK;

            //walls
            if (i < mapLength - 2)
                this.#map[i][1] = GameObjectTypeClient.LEFTWALL;
            this.#map[mapLength - 2][i + 2] = GameObjectTypeClient.RIGHTWALL;
        }

        for (var i = 0; i < this.#listOfGameObjects.length; i++) {
            if (this.#listOfGameObjects[i].getName().startsWith("Table")) {
                var positionX = this.#listOfGameObjects[i].getPosition().getCordX();
                var positionY = this.#listOfGameObjects[i].getPosition().getCordY();
                this.#map[positionX + 2][positionY] = GameObjectTypeClient.TABLE;
            }
        }

        if (this.#typeOfRoom == "FOYER") {
            this.#map[2][0] = GameObjectTypeClient.LEFTTILE;
            this.#map[2][1] = GameObjectTypeClient.LECTUREDOOR;
            this.#map[mapLength - 2][4] = GameObjectTypeClient.FOODCOURTDOOR;
            this.#map[mapLength - 1][4] = GameObjectTypeClient.RIGHTTILE;
            this.#map[mapLength - 2][this.#map[0].length - 3] = GameObjectTypeClient.RECEPTIONDOOR;
            this.#map[mapLength - 1][this.#map[0].length - 3] = GameObjectTypeClient.RIGHTTILE;
        }
    }


    getMap() {
        return this.#map;
    }
    

    #buildOccMap = function() {
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
    }
}
