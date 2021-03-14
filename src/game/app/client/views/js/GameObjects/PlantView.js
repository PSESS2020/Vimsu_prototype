/**
 * The Plant Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class PlantView extends GameObjectView {
    #story = ['Hey I\'m a beautiful plant. Don\'t touch me!',
              'Seriously, DON\'T TOUCH ME!!'];

    #id = 'plant'

    /**
     * Creates an instance of PlantView
     * 
     * @param {Image} objectImage plant image
     * @param {PositionClient} gridPosition plant position
     * @param {number} screenPositionOffset platn screen position offset
     * @param {String} name plant name
     */
    constructor(objectImage, clickMap, gridPosition, screenPositionOffset, name) {
        super(objectImage, clickMap, gridPosition, screenPositionOffset, name);
    }

    /**
     * Called if participant clicks the plant
     */
    onclick() {
        const npcStoryView = new NPCStoryView()
        npcStoryView.addNewNPCStoryWindow(this.#id)
        npcStoryView.draw("Beautiful Plant", this.#story, this.#id);
    }
}