class GameMapElementView extends GameObjectView {

    constructor(mapElementImage, position, screenPositionOffset, name) {
        super(mapElementImage, position, screenPositionOffset, name);
    }

    draw() {
        ctx_map.drawImage(super.getObjectImage(), super.getScreenPosition().getCordX() + super.getScreenPositionOffset().x, 
                                                  super.getScreenPosition().getCordY() + super.getScreenPositionOffset().y);
    }

    onclick() {
        throw new Error('onclick() has to be implemented!');
    }
}