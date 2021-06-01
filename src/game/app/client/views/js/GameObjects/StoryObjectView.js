/**
 * Object that can be clicked and then displays a message.
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class StoryObjectView extends GameObjectView {

    gameObjectID;
    story
    id
    descriptor

    /**
     * Creates an instance of PlantView
     * 
     * @param {Image} objectImage object image
     * @param {PositionClient} gridPosition object position
     * @param {number} screenPositionOffset object screen position offset
     * @param {String} name object name
     * @param {number} gameObjectID ID of gameObject that is represented by this view
     * @param {String[]} story the text messages displayed when clicked
     * @param {String} descriptor the "name" of the object
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name, gameObjectID, story, descriptor) {
        super(objectImage, clickMap, gridPosition, screenPositionOffset, name);

        this.gameObjectID = gameObjectID;
        this.story = story
        this.descriptor = descriptor[0] + descriptor.slice(1, descriptor.length).toLowerCase();
    }

    /**
     * Returns object ID
     * 
     * @returns {number} object ID
     */
     getGameObjectID() {
        return this.gameObjectID;
    }

    /**
     * Called if participant clicks the object
     */
    onclick() {
        const npcStoryView = new NPCStoryView()
        npcStoryView.addNewNPCStoryWindow(this.gameObjectID)
        npcStoryView.draw(this.descriptor, this.story, this.gameObjectID);
    }
}