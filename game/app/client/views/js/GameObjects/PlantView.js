class PlantView extends GameObjectView {
    #story = ['Hey I\'m a beautiful plant. Don\'t touch me!',
                'Seriously, DON\'T TOUCH ME!!'];

    /**
     * @constructor Creates an instance of PlantView
     * 
     * @param {Image} objectImage plant image
     * @param {PositionClient} gridPosition plant position
     * @param {number} screenPositionOffset platn screen position offset
     * @param {String} name plant name
     */
    constructor(objectImage, gridPosition, screenPositionOffset, name) {
        super(objectImage, gridPosition, screenPositionOffset, name);
    }

    /**
     * Called if participant clicks the plant
     */
    onclick() {
        new NPCStoryView().draw("Beautiful Plant", this.#story);
    }
}