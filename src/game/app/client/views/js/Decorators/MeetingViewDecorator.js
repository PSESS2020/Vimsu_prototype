/**
 * The Meeting View Decorator
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class MeetingViewDecorator {
    /**
     * @static Takes an object view instance and adds the required
     *         functionality to properly display a meeting on click.
     * 
     * @param {GameObjectView OR GameMapElementView} viewObject 
     * @param {Integer} passedObjectID
     * @param {Object} meetingData Object containing the data of the meeting
     *                             that will be opened on click. 
     * @param {EventManager} passedEventManager 
     */
     static decorate(viewObject, passedObjectID, meetingData, passedEventManager) {
        TypeChecker.isInt(passedObjectID)
        TypeChecker.isInstanceOf(meetingData, Object);
        TypeChecker.isString(meetingData.id);
        TypeChecker.isString(meetingData.domain);
        TypeChecker.isString(meetingData.name);
        TypeChecker.isString(meetingData.password);
        if (!viewObject.hasOwnProperty(GlobalStrings.ISDECORATED)) {
            Object.defineProperties(viewObject, {
                // Saving these two is actually not needed
                gameObjectID: { get: () => passedObjectID },
                eventManager: { get: () => passedEventManager },
                meeting:      { get: () => meetingData },
                getGameObjectID: { value: function () { return this.gameObjectID } },
                getGameObjectMeeting: { value: function () { return this.meeting } },
                onClick: { value: function () { this.eventManager.handleMeetingJoined(this.meeting) } },
                [GlobalStrings.ISDECORATED]: { get: () => true }
            })
        } else { console.log(`Object ${viewObject.getName()} with id ${viewObject.getGameObjectID()} has already been decorated.`) }
    }
}