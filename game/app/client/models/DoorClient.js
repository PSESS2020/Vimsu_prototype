class DoorClient {

    #id;
    #typeOfDoor;
    #mapPosition;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {String} typeOfDoor
     * @param {PositionClient} mapPosition
     */
    constructor(id, typeOfDoor, mapPosition) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoorClient);
        TypeChecker.isInstanceOf(mapPosition, PositionClient);

        this.#id = id;
        this.#typeOfDoor = typeOfDoor;
        this.#mapPosition = mapPosition;
    }

    getStartingRoomId() {
        return this.#mapPosition.getRoomId();
    }

    getTypeOfDoor() {
        return this.#typeOfDoor;
    }

    getMapPosition() {
        return this.#mapPosition;
    }
}