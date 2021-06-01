const OnClickData = require("./OnClickData");
const TypeOfOnClickData  = require("../../../client/shared/TypeOfOnClickData")

/**
 * @module OnClickStoryData
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class OnClickStoryData extends OnClickData {

    #story

    /**
     * @constructor module:OnClickStoryData
     * 
     * @param {String[]} story the story being displayed on click
     */
    constructor(story) {
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