/**
 * @enum clickable object view creators
 *  
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const ClickableObjectViewCreators = Object.freeze({
    [OnClickDataType.IFRAME](onClickData) {
        return new IFrameObjectView(/* TODO add data */)
    },
    [OnClickDataType.STORY](onClickData) {
        return new StoryObjectView(/* TODO add data */)
    },
    [OnClickDataType.MEETING](onClickData) {
        return new MeetingObjectView(/* TODO add data */)
    },
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ClickableObjectViewCreators;
}


