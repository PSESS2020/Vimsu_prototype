/**
 * The Meeting Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class MeetingObjectView extends GameObjectView {

    gameObjectID;
    eventManager;

    /**
     * Creates an instance of IFrameObjectView
     * 
     * @param {Image} objectImage object image
     * @param {PositionClient} gridPosition object position
     * @param {number} screenPositionOffset object screen position offset
     * @param {String} name object name
     * @param {Object} meeting Object containing the data of the meeting
     *                         that will be opened on click.
     * @param {EventManager} eventManager event manager instance
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name, gameObjectID, meeting, eventManager) {
        super(objectImage, clickMap, gridPosition, screenPositionOffset, name);
        TypeChecker.isInstanceOf(meeting, Object);
        TypeChecker.isString(meeting.id);
        TypeChecker.isString(meeting.domain);
        TypeChecker.isString(meeting.name);
        TypeChecker.isString(meeting.password);

        this.gameObjectID = gameObjectID;
        this.meeting = meeting;
        this.eventManager = eventManager;
    }

    /**
     * Returns IFrame object ID
     * 
     * @returns {number} IFrame object ID
     */
    getGameObjectMeeting() {
        return this.meeting;
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
        this.eventManager.handleMeetingJoined(this.meeting);  
    }
}