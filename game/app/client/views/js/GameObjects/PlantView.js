class PlantView extends GameObjectView {
    #story = ['Hey I\'m a beautiful plant. Don\'t touch me!',
                'Seriously, DON\'T TOUCH ME!!'];

    constructor(objectImage, gridPosition, screenPositionOffset, name) {
        super(objectImage, gridPosition, screenPositionOffset, name);
    }

    onclick() {
        new NPCStoryView().draw("Beautiful Plant", this.#story);
    }
}