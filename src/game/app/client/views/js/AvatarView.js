/**
 * The Avatar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AvatarView extends Views {

    #position;
    #direction;
    #walking = false;
    #spriteSheet;
    #isVisible;

    /**
     * Creates an instance of AvatarView
     * 
     * @param {PositionClient} position avatar position
     * @param {Direction} direction avatar direction
     */
    constructor(position, direction) {
        super();

        this.#position = position;
        this.#direction = direction;

        if (new.target === AvatarView) {
            throw new Error("Cannot construct abstract AvatarView instances directly");
        }
    }

    /**
     * Sets position of avatar
     * @param {PositionClient} position avatar position
     */
    setPosition(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
    }

    /**
     * Gets avatar position
     * 
     * @return {PositionClient} position
     */
    getGridPosition() {
        return this.#position;
    }

    /**
     * Sets avatar direction
     * 
     * @param {Direction} direction avatar direction
     */
    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#direction = direction;
    }

    /**
     * Gets avatar direction
     * 
     * @return {Direction} direction
     */
    getDirection() {
        return this.#direction;
    }

    /**
     * Sets avatar spritesheet
     * 
     * @param {SpriteSheet} spriteSheet sprite sheet
     */
    setSpriteSheet(spriteSheet) {
        this.#spriteSheet = spriteSheet
    }

    /**
     * Gets avatar spritesheet
     * 
     * @return {SpriteSheet} spriteSheet
     */
    getSpriteSheet() {
        return this.#spriteSheet;
    }

    /**
     * Gets avatar isWalking status
     * 
     * @return {boolean} true if the Avatar is currently walking, otherwise false
     */
    isWalking() {
        return this.#walking;
    }

    /**
     * Gets avatar visibility
     * 
     * @return {boolean} true if avatar is visible, otherwise false
     */
    getVisibility() {
        return this.#isVisible;
    }

    /**
     * Sets avatar visibility
     * 
     * @param {boolean} visible true if visible, otherwise false
     */
    setVisibility(visible) {
        this.#isVisible = visible;
    }

    /**
     * @abstract Draws avatar
     */
    draw() {
        throw new Error('draw() has to be implemented!');
    }

    /**
     * @abstract called if avatar is clicked
     */
    onClick() {
        throw new Error('onClick() has to be implemented!');
    }

    /**
     * @abstract Updates avatar view
     */
    update() {
        throw new Error('update() has to be implemented!')
    }
}
