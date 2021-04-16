/**
 * Object that can be clicked and then displays a message.
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameObjectWithStoryView extends GameObjectView {

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
     * @param {string} id used to identify the text message view
     * @param {String[]} story the text messages displayed when clicked
     * @param {String} descriptor the "name" of the object
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name, gameObjectID, id, story, descriptor) {
        super(objectImage, clickMap, gridPosition, screenPositionOffset, name);

        this.gameObjectID = gameObjectID;
        this.id = id
        this.story = story

        this.descriptor = descriptor[0] + descriptor.slice(1, descriptor.length).toLowerCase();
    }

    /**
     * Returns plant ID
     * 
     * @returns {number} plant ID
     */
     getGameObjectID() {
        return this.gameObjectID;
    }

    /**
     * Called if participant clicks the plant
     */
    onclick() {
        const npcStoryView = new NPCStoryView()
        npcStoryView.addNewNPCStoryWindow(this.id)
        npcStoryView.draw(this.descriptor, this.story, this.id);
    }
}