/**
 * The IFrame Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class IFrameObjectView extends GameObjectView {

    gameObjectID;
    eventManager;

    /**
     * Creates an instance of IFrameObjectView
     * 
     * @param {Image} objectImage object image
     * @param {PositionClient} gridPosition object position
     * @param {number} screenPositionOffset object screen position offset
     * @param {String} name object name
     * @param {number} gameObjectID ID of gameObject that is represented by this view
     * @param {EventManager} eventManager event manager instance
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name, gameObjectID, eventManager) {
        super(objectImage, clickMap, gridPosition, screenPositionOffset, name);
        TypeChecker.isInt(gameObjectID);

        this.gameObjectID = gameObjectID;
        this.eventManager = eventManager;
    }

    /**
     * Returns IFrame object ID
     * 
     * @returns {number} IFrame object ID
     */
    getGameObjectID() {
        return this.gameObjectID;
    }

    /**
     * Called if participant clicks the iFrameObject
     */
    onclick() {
        this.eventManager.handleIFrameObjectClick(this.gameObjectID);  
    }
}