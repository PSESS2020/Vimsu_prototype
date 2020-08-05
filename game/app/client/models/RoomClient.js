
/*module.exports = */class RoomClient {

    #roomId;
    //clientRoomChat
    #typeOfRoom;
    #length;
    #width;
    #listOfPPants;
    #occupationMap;
    #listOfNPCs;
    #listOfGameObjects;
    #listOfDoors;
    #map;
    
    /**
     * Erzeugt RoomClient Instanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoomClient} typeOfRoom
     * @param {Array of GameObjectClient} listOfGameObjects
     * @param {Array of NPCClient} listOfNPCs
     * @param {Array of DoorClient} listOfDoors
     * @param {int} length 
     * @param {int} width 
     */
    constructor(roomId, typeOfRoom, listOfGameObjects, listOfNPCs, listOfDoors, width ,length) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoomClient);
        TypeChecker.isInstanceOf(listOfGameObjects, Array);
        listOfGameObjects.forEach(gameObject => {
            TypeChecker.isInstanceOf(gameObject, GameObjectClient);
        });
        TypeChecker.isInstanceOf(listOfNPCs, Array);
        listOfNPCs.forEach(npc => {
            TypeChecker.isInstanceOf(npc, NPCClient);
        });
        TypeChecker.isInstanceOf(listOfDoors, Array);
        listOfDoors.forEach(door => {
            TypeChecker.isInstanceOf(door, DoorClient);
        });
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);

        //Es existiert nur RoomClientInstanz des Raumes, in dem sich der Teilnehmer gerade befindet
        if (!!RoomClient.instance) {
            return RoomClient.instance;
        }

        RoomClient.instance = this;

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        this.#listOfGameObjects = listOfGameObjects;
        this.#listOfNPCs = listOfNPCs;
        this.#listOfDoors = listOfDoors;
        this.#listOfPPants = [];
        this.#width = width;
        this.#length = length;
        

        //TODO: add other room types

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

    getListOfNPCs() {
        return this.#listOfNPCs;
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
     * @param {int} participantId 
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
     ** @param {int} roomId 
     * @param {TypeOfRoomClient} typeOfRoom
     * @param {Array of GameObjectClient} listOfGameObjects
     * @param {Array of NPCClient} listOfNPCs
     * @param {Array of DoorClient} listOfDoors
     * @param {int} length 
     * @param {int} width 
     */
    swapRoom(roomId, typeOfRoom, listOfGameObjects, listOfNPCs, listOfDoors, width, length) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoomClient);
        TypeChecker.isInstanceOf(listOfGameObjects, Array);
        listOfGameObjects.forEach(gameObject => {
            TypeChecker.isInstanceOf(gameObject, GameObjectClient);
        });
        TypeChecker.isInstanceOf(listOfNPCs, Array);
        listOfNPCs.forEach(npcPosition => {
            TypeChecker.isInstanceOf(npcPosition, NPCClient);
        });
        TypeChecker.isInstanceOf(listOfDoors, Array);
        listOfDoors.forEach(door => {
            TypeChecker.isInstanceOf(door, DoorClient);
        });
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        //reset list of game objects, participants, occMap
        this.#listOfGameObjects = listOfGameObjects;
        this.#listOfNPCs = listOfNPCs;
        this.#listOfDoors = listOfDoors;
        this.#listOfPPants = [];
        this.#width = width;
        this.#length = length;
        
        this.#occupationMap = new Array(this.#width);
        for (var i = 0; i < this.#width; i++) {
            this.#occupationMap[i] = new Array(this.#length).fill(0);
        }
    
        this.#buildOccMap();
        this.buildMapArray();
    }

    buildMapArray() {

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

        //Tile in the upper right corner that has not been replaced
        this.#map[mapLength - 2][1] = GameObjectTypeClient.BLANK;

        for (var i = 0; i < this.#listOfGameObjects.length; i++) {
            if (this.#listOfGameObjects[i].getName().startsWith("table")) {
                var positionX = this.#listOfGameObjects[i].getPosition().getCordX();
                var positionY = this.#listOfGameObjects[i].getPosition().getCordY();
                this.#map[positionX][positionY + 2] = GameObjectTypeClient.TABLE;
            }
        }

        //set door positions in map
        for (var i = 0; i < this.#listOfDoors.length; i++) {
            var positionX = this.#listOfDoors[i].getMapPosition().getCordX();
            var positionY = this.#listOfDoors[i].getMapPosition().getCordY();
            if (this.#listOfDoors[i].getTypeOfDoor() === TypeOfDoorClient.FOYER_DOOR) {

                this.#map[positionX][positionY - 1] = GameObjectTypeClient.LEFTTILE;
                this.#map[positionX][positionY] = GameObjectTypeClient.FOYERDOOR;

            } else if (this.#listOfDoors[i].getTypeOfDoor() === TypeOfDoorClient.RECEPTION_DOOR) {

                this.#map[positionX + 1][positionY] = GameObjectTypeClient.RIGHTTILE;
                this.#map[positionX][positionY] = GameObjectTypeClient.RECEPTIONDOOR;
                
            } else if (this.#listOfDoors[i].getTypeOfDoor() === TypeOfDoorClient.FOODCOURT_DOOR) {

                this.#map[positionX + 1][positionY] = GameObjectTypeClient.RIGHTTILE;
                this.#map[positionX][positionY] = GameObjectTypeClient.FOODCOURTDOOR;
            

            } else if (this.#listOfDoors[i].getTypeOfDoor() === TypeOfDoorClient.LECTURE_DOOR) {
                this.#map[positionX][positionY - 1] = GameObjectTypeClient.LEFTTILE;
                this.#map[positionX][positionY] = GameObjectTypeClient.LECTUREDOOR;

            }
        
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

        //NPC collision
        for (var i = 0; i < this.#listOfNPCs.length; i++) {
            let cordX = this.#listOfNPCs[i].getPosition().getCordX();
            let cordY = this.#listOfNPCs[i].getPosition().getCordY();

            this.#occupationMap[cordX][cordY] = 1;

        }
    }
}
