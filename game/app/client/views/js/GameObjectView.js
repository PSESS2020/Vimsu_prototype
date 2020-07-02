class GameObjectView extends Views {

    #objectId;
    #position;
    

    constructor(objectId, position) {
        super();
        TypeChecker.isInt(objectId);
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#objectId = objectId;
        this.#position = position;

        if (new.target === GameObjectView) {
            throw new Error("Cannot construct abstract GameObjectView instances directly");
        }
    }

    draw() {
        throw new Error('draw() has to be implemented!');
    }

    onclick() {
        throw new Error('onClick() has to be implemented!');
    }   
}