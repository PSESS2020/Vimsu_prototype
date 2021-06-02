/**
 * The Schedule View Decorator
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class ScheduleViewDecorator {
    /**
     * @static Takes an object view instance and adds the required
     *         functionality to properly display a schedule on click.
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
                onClick: { value: function(mousePos) { 
                    if (viewObject.getClickMapValueWithGridCoords(mousePos) === 1) {
                        //This Event fires multiple times because of three parallel schedule images.
                        //Not sure how to prevent this.
                        $('#noschedule').empty();
                        $('#scheduleModal .modal-body #schedule > tbody:last-child').empty();
                        $('#scheduleModal').modal('show');
                        $('#scheduleWait').show()
                        this.eventManager.handleScheduleClicked();
                    }
                } },
                [GlobalStrings.ISDECORATED]: { get: () => true }
            })
        } else { console.log(`Object ${viewObject.getName()} with id ${viewObject.getGameObjectID()} has already been decorated.`) }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ScheduleViewDecorator;
}