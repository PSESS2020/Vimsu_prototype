/**
 * @enum clickable object view creators
 *  
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const ClickableObjectViewCreators = Object.freeze({
    [TypeOfOnClickData.IFRAME] (image, clickMap, position, offset, name, objectID, onClickData, eventManager) {
        return new IFrameObjectView(image, clickMap, position, offset, name, objectID, eventManager)
    },
    [TypeOfOnClickData.STORY] (image, clickMap, position, offset, name, objectID, onClickData, eventManager) {
        const { story } = onClickData
        return new StoryObjectView(image, clickMap, position, offset, name, objectID, story, )
    },
    [TypeOfOnClickData.MEETING] (image, clickMap, position, offset, name, objectID, onClickData, eventManager) {
        return new MeetingObjectView(/* TODO add data */)
    },
    [TypeOfOnClickData.SCHEDULE] (image, clickMap, position, offset, name, objectID, onClickData, eventManager) {
        return new ScheduleView(/* TODO add data */)
    }
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ClickableObjectViewCreators;
}


