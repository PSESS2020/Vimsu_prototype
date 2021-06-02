/**
 * The IFrame View Decorator
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class IFrameViewDecorator {
    /**
     * @static Takes an object view instance and adds the required
     *         functionality to properly display an iFrame on click.
     * 
     * @param {GameObjectView OR GameMapElementView} viewObject 
     * @param {Integer} passedObjectID 
     * @param {EventManager} passedEventManager 
     */
    static decorate(viewObject, passedObjectID, passedEventManager) {
        TypeChecker.isInt(passedObjectID)
        if (!viewObject.hasOwnProperty(GlobalStrings.ISDECORATED)) {
            Object.defineProperties(viewObject, {
                // Saving these two is actually not needed
                gameObjectID: { get: () => passedObjectID },
                eventManager: { get: () => passedEventManager },
                getGameObjectID: { value: function() { return this.gameObjectID } },
                onClick: { value: function() { this.eventManager.handleIFrameObjectClick(this.gameObjectID) } },
                [GlobalStrings.ISDECORATED]: { get: () => true }
            })
        } else { console.log(`Object ${viewObject.getName()} with id ${viewObject.getGameObjectID()} has already been decorated.`) }
    }
}