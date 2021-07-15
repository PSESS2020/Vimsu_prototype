/**
 * The Avatar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AvatarView extends AbstractView {

    position;
    direction;
    walking = false;
    isVisible;
    shirtColor;
    spriteSheet;
    topClothing;
    bottomClothing;
    shoes;

    /**
     * Creates an instance of AvatarView
     * 
     * @param {PositionClient} position avatar position
     * @param {Direction} direction avatar direction
     * @param {ShirtColor} shirtColor avatar shirt color
     */
    constructor(position, direction, shirtColor) {
        super();

        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isEnumOf(shirtColor, ShirtColor);

        this.position = position;
        this.direction = direction;
        this.shirtColor = shirtColor;

        this.spriteSheet = new SpriteSheet('../client/assets/avatar/CharacterSpriteSheetBody.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        this.topClothing = new SpriteSheet('../client/assets/avatar/TopClothing' + shirtColor + 'ShirtSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        this.bottomClothing = new SpriteSheet('../client/assets/avatar/BottomBlackTrousersSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        this.shoes = new SpriteSheet('../client/assets/avatar/ShoesBlackSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);

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
        this.position = position;
    }

    /**
     * Gets avatar position
     * 
     * @return {PositionClient} position
     */
    getGridPosition() {
        return this.position;
    }

    /**
     * Sets avatar direction
     * 
     * @param {Direction} direction avatar direction
     */
    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.direction = direction;
    }

    /**
     * Gets avatar direction
     * 
     * @return {Direction} direction
     */
    getDirection() {
        return this.direction;
    }

    /**
     * Sets avatar spritesheet
     * 
     * @param {SpriteSheet} spriteSheet sprite sheet
     */
    setSpriteSheet(spriteSheet) {
        this.spriteSheet = spriteSheet;
    }

    /**
     * Gets avatar spritesheet
     * 
     * @return {SpriteSheet} spriteSheet
     */
    getSpriteSheet() {
        return this.spriteSheet;
    }

    /**
     * Gets top clothing spritesheet
     * 
     * @return {SpriteSheet} topClothing
     */
    getTopClothing() {
        return this.topClothing;
    }

    /**
     * Gets bottom clothing spritesheet
     * 
     * @return {SpriteSheet} bottomClothing
     */
    getBottomClothing() {
        return this.bottomClothing;
    }

    /**
     * Gets shoes spritesheet
     * 
     * @return {SpriteSheet} shoes
     */
    getShoes() {
        return this.shoes;
    }

    /**
     * Gets avatar isWalking status
     * 
     * @return {boolean} true if the Avatar is currently walking, otherwise false
     */
    isWalking() {
        return this.walking;
    }

    /**
     * Gets avatar visibility
     * 
     * @return {boolean} true if avatar is visible, otherwise false
     */
    getVisibility() {
        return this.isVisible;
    }

    /**
     * Sets avatar visibility
     * 
     * @param {boolean} visible true if visible, otherwise false
     */
    setVisibility(visible) {
        this.isVisible = visible;
    }

    /**
     * Gets avatar shirt color
     * 
     * @return {ShirtColor} avatar shirt color
     */
    getShirtColor() {
        return this.shirtColor;
    }

    /**
     * Updates avatar shirt color
     * 
     * @param {ShirtColor} shirtColor 
     */
    updateShirtColor(shirtColor) {
        TypeChecker.isEnumOf(shirtColor, ShirtColor);
        
        this.shirtColor = shirtColor;
        this.topClothing = new SpriteSheet('../client/assets/avatar/TopClothing' + shirtColor + 'ShirtSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        this.initSpriteAnimation();
    }

    /**
     * @abstract Initializes sprite animation
     */
    initSpriteAnimation() {
        throw new Error('initSpriteAnimation() has to be implemented!');
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
        throw new Error('update() has to be implemented!');
    }
}
