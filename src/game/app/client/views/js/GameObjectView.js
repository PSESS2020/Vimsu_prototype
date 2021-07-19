/**
 * The Game Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameObjectView extends AbstractView {

    objectImage;
    clickMap;
    gridPosition;
    screenPositionOffset;
    name;
    screenPosition;

    /**
     * Creates an instance of GameObjectView
     * 
     * @param {Image} objectImage game object image
     * @param {number[][]} clickMap schedule clickMaps
     * @param {PositionClient} gridPosition game object position
     * @param {number} screenPositionOffset screen position offset
     * @param {String} name game object name
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name) {
        super();
        TypeChecker.isInstanceOf(gridPosition, PositionClient);
        TypeChecker.isInstanceOf(objectImage, Image);
        TypeChecker.isInstanceOf(clickMap, Array);
        TypeChecker.isInstanceOf(screenPositionOffset, Object);
        TypeChecker.isString(name);


        this.objectImage = objectImage;
        this.clickMap = clickMap;
        this.gridPosition = gridPosition;
        this.screenPositionOffset = screenPositionOffset;
        this.name = name;
    }

    /**
     * Gets game object image
     * 
     * @return {Image} objectImage
     */
    getObjectImage() {
        return this.objectImage;
    }

    /**
     * Gets grid position
     * 
     * @return {PositionClient} gridPosition
     */
    getGridPosition() {
        return this.gridPosition;
    }

    /**
     * Gets screen position
     * 
     * @return {PositionClient} screenPosition
     */
    getScreenPosition() {
        return this.screenPosition;
    }

    /**
     * Gets screen position offset
     * 
     * @return {number} screenPositionOffset
     */
    getScreenPositionOffset() {
        return this.screenPositionOffset;
    }

    /**
     * Checks if the the clickable area of this view object contains the given point.
     * 
     * @param {number} x The x position of the point to check
     * @param {number} y The y position of the point to check
     * @return {boolean} True if the point is contained in the clickable area
     */
    contains(x, y) {
        var clickImgCordX = Math.abs(Math.abs(this.screenPosition.getCordX() - Math.round(x)));
        
        var clickImgCordY = Math.abs((this.screenPosition.getCordY() + this.screenPositionOffset.y) - Math.round(y));

        return this.clickMap[clickImgCordY][clickImgCordX] === 1;
    }

    /**
     * Checks if the the image of this view object contains the given point.
     * 
     * @param {number} x The x position of the point to check
     * @param {number} y The y position of the point to check
     * @return {boolean} True if the point is contained in the image of this view object
     */
     assetContains(x, y) {
        return x > this.screenPosition.getCordX() + this.screenPositionOffset.x
            && x < this.screenPosition.getCordX() + this.screenPositionOffset.x + this.objectImage.width
            && y > this.screenPosition.getCordY() + this.screenPositionOffset.y
            && y < this.screenPosition.getCordY() + this.screenPositionOffset.y + this.objectImage.height;
    }

    /**
     * Gets game object name
     * 
     * @return {String} name
     */
    getName() {
        return this.name;
    }

    /**
     * Updates grid position
     * 
     * @param {PositionClient} gridPosition grid position
     */
    updateGridPos(gridPosition) {
        TypeChecker.isInstanceOf(gridPosition, PositionClient);

        this.gridPosition = gridPosition;
    }

    /**
     * Updates screen position
     * 
     * @param {PositionClient} screenPosition screen position
     */
    updateScreenPos(screenPosition) {
        TypeChecker.isInstanceOf(screenPosition, PositionClient);

        this.screenPosition = screenPosition;
    }

    /**
     * Draws game object
     */
    draw() {

        //screen position is not set yet
        if (!this.screenPosition) {
            return;
        }

        ctx_avatar.drawImage(this.objectImage, this.screenPosition.getCordX() + this.screenPositionOffset.x,
            this.screenPosition.getCordY() + this.screenPositionOffset.y);
    }

    /**
     * @abstract called if game object is clicked
     */
    onclick() {
        throw new Error('onclick() has to be implemented!');
    }
}
