/**
 * The Game Map Element View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameMapElementView extends GameObjectView {

    /**
     * @constructor Creates an instance of GameMapElementView
     * 
     * @param {Image} mapElementImage map element image
     * @param {PositionClient} position map element position
     * @param {number} screenPositionOffset screen position offset
     * @param {String} name map element name
     */
    constructor(mapElementImage, position, screenPositionOffset, name) {
        super(mapElementImage, position, screenPositionOffset, name);
    }

    /**
     * Draws game map element
     */
    draw() {
        ctx_map.drawImage(super.getObjectImage(), super.getScreenPosition().getCordX() + super.getScreenPositionOffset().x, 
                                                  super.getScreenPosition().getCordY() + super.getScreenPositionOffset().y);
    }

    /**
     * @abstract called if game map element is clicked
     */
    onclick() {
        throw new Error('onclick() has to be implemented!');
    }
}