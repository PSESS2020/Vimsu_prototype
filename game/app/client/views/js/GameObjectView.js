class GameObjectView extends Views {

    #tileImage;
    #position;

    constructor(tileImage, position) {
        super();
        this.#tileImage = tileImage;
        TypeChecker.isInstanceOf(position, PositionClient);
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