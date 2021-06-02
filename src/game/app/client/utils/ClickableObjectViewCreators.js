/**
 * @enum clickable object view creators
 *  
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const ClickableObjectViewCreators = Object.freeze({
    [TypeOfOnClickData.IFRAME] (creationData) {
        const { gameObjectImage, clickMap, pos, offset, objectName, gameObjectID, eventManager } = creationData
        return new IFrameObjectView( gameObjectImage, clickMap, pos, offset, objectName, gameObjectID, eventManager )
    },

    [TypeOfOnClickData.STORY] (creationData) {
        const { gameObjectImage, clickMap, pos, offset, gameObjectType, objectName, gameObjectID, onClickData } = creationData
        const { story } = onClickData
        return new StoryObjectView( gameObjectImage, clickMap, pos, offset, objectName, gameObjectID, story, gameObjectType )
    },

    [TypeOfOnClickData.MEETING] (creationData) {
        const { gameObjectImage, clickMap, pos, offset, objectName, eventManager } = creationData
        const { id, domain, name, password } = onClickData
        return new MeetingObjectView( gameObjectImage, clickMap, pos, offset, objectName, { id, domain, name, password }, eventManager )
    },
    
    [TypeOfOnClickData.SCHEDULE] (creationData) {
        const { gameObjectImage, clickMap, pos, offset, objectName, eventManager } = creationData
        return new ScheduleView( gameObjectImage, clickMap, pos, offset, objectName, eventManager )
    },

    [TypeOfOnClickData.EMPTY] (creationData) {
        const { gameObjectImage, clickMap, pos, offset, objectName } = creationData
        return new GameMapElementView( gameObjectImage, clickMap, pos, offset, objectName )
    },
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ClickableObjectViewCreators;
}


