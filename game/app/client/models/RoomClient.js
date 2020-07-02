//var TypeChecker = require('../../utils/TypeChecker.js');
//var ParticipantClient = require('./ParticipantClient.js');

/*module.exports = */class RoomClient {

    #roomId;
    //clientRoomChat
    #length;
    #width;
    #listOfPPants;
    #occupationMap;
    //listOfNPCs
    //listOfGameObjects (haben im Entwurf keine ClientVersion?)
    //listOfDoors

    /**
     * Erzeugt RoomClient Instanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {int} length 
     * @param {int} width 
     * @param {Array of ParticipantClient} listOfPPants 
     * @param {Array of Array of int} occupationMap 
     */
    constructor(roomId, length, width, listOfPPants, occupationMap) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(length);
        TypeChecker.isInt(width);
        TypeChecker.isInstanceOf(listOfPPants, Array);

        listOfPPants.forEach(element => {
            TypeChecker.isInstanceOf(element, ParticipantClient);
        });

        TypeChecker.isInstanceOf(occupationMap, Array);

        occupationMap.forEach(element => {
            TypeChecker.isInstanceOfOf(element, Array);
            element.forEach(item, item => {
                TypeChecker.isInt(item);
            });
        });

        
        //Es existiert nur RoomClientInstanz des Raumes, in dem sich der Teilnehmer gerade befindet
        if(RoomClient.instance) {
            return RoomClient.instance;
        }

        RoomClient.instance = this;

        this.#roomId = roomId;
        this.#length = length;
        this.#width = width;
        this.#listOfPPants = listOfPPants;
        this.#occupationMap = occupationMap;
    }

    getRoomId() {
        return this.#roomId;
    }

    getWidth() {
        return this.#width;
    }

    getLength() {
        return this.#length;
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
     * @param {int} length 
     * @param {int} width 
     * @param {Array of ParticipantClient} listOfPPants 
     * @param {Array of Array of int} occupationMap 
     */
    swapRoom(roomId, length, width, listOfPPants, occupationMap) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(length);
        TypeChecker.isInt(width);
        TypeChecker.isInstanceOf(listOfPPants, Array);

        listOfPPants.forEach(element => {
            TypeChecker.isInstanceOf(element, ParticipantClient);
        });

        TypeChecker.isInstanceOf(occupationMap, Array);

        occupationMap.forEach(element => {
            TypeChecker.isInstanceOfOf(element, Array);
            element.forEach(item, item => {
                TypeChecker.isInt(item);
            });
        });

        this.#roomId = roomId;
        this.#length = length;
        this.#width = width;
        this.#listOfPPants = listOfPPants;
        this.#occupationMap = occupationMap;
    }
}