/**
 * The story view decorator.
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class StoryViewDecorator {
    /**
     * @static Takes an object view instance and adds the required
     *         functionality to properly display a story on click.
     * 
     * @param {GameObjectView OR GameMapElementView} viewObject 
     * @param {Integer} passedObjectID 
     * @param {String[]} storyData The text that will be displayed on click
     * @param {String} headerName Name that will be displayed in the header
     */
     static decorate(viewObject, passedObjectID, storyData, headerName) {
        TypeChecker.isInt(passedObjectID)
        TypeChecker.isSting(headerName)
        TypeChecker.isInstanceOf(storyData, Array)
        storyData.forEach( x => TypeChecker.isString(x) )
        if (!viewObject.hasOwnProperty(GlobalStrings.ISDECORATED)) {
            Object.defineProperties(viewObject, {
                // Saving these two is actually not needed
                gameObjectID: { get: () => passedObjectID },
                story: { get: () => storyData },
                descriptor: { get: () => (headerName[0] + headerName.slice(1, headerName.length)) },
                getGameObjectID: { value: function() { return this.gameObjectID } },
                getStory: { value: function() { return this.story } },
                getDescriptor: { value: function() { return this.descriptor } },
                onClick: { value: function() { 
                    const npcStoryView = new NPCStoryView()
                    npcStoryView.addNewNPCStoryWindow(this.gameObjectID)
                    npcStoryView.draw(this.descriptor, this.story, this.gameObjectID)
                } },
                [GlobalStrings.ISDECORATED]: { get: () => true }
            })
        } else { console.log(`Object ${viewObject.getName()} with id ${viewObject.getGameObjectID()} has already been decorated.`) }
    } 
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = StoryViewDecorator;
}