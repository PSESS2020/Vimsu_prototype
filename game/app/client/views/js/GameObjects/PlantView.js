class PlantView extends GameObjectView {
    #story = ['Hey I\'m a beautiful plant. Don\'t touch me!',
                'Seriously, DON\'T TOUCH ME!!'];

    /**
     * @constructor Creates an instance of PlantView
     * 
     * @param {Image} objectImage 
     * @param {PositionClient} gridPosition 
     * @param {number} screenPositionOffset 
     * @param {String} name 
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