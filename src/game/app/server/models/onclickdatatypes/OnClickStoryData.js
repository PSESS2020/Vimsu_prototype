const OnClickDataParent = require("./OnClickDataParent");
const TypeOfOnClickData  = require("../../../client/shared/TypeOfOnClickData");
const TypeChecker = require("../../../client/shared/TypeChecker");

/**
 * @module OnClickStoryData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class OnClickStoryData extends OnClickDataParent {

    #story

    /**
     * @constructor module:OnClickStoryData
     * 
     * @param {String[]} story the story being displayed on click
     */
    constructor(story) {
        super()
        TypeChecker.isInstanceOf(story, Array)
        story.forEach(elem => TypeChecker.isString(elem))
        this.#story = story
    }

    /**
     * @method module:OnClickStoryData#getData
     * 
     * @return { { type: TypeOfOnClickData, 
     *             story: String[]         } } the data needed to properly
     *                                         display the story.
     */
    getData() {
        return Object.freeze({
            type: TypeOfOnClickData.STORY,
            story: this.#story
        })
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickStoryData
}