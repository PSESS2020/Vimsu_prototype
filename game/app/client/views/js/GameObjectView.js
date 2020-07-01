class GameObjectView {

    #objectId;
    #position;
    #canCollideWithPlayer;
    

    constructor(objectId, position) {
        this.#objectId = objectId;
        this.#objectId = position;;
    }

    setCollision(canCollideWithPlayer) {
        this.#canCollideWithPlayer = canCollideWithPlayer;
    }

    getCollision() {
        return this.#canCollideWithPlayer;
    }

    draw() {

    }

    onclick() {
        
    }

    

}