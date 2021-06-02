/**
 * A wrapper class to allow us to access the view decorators via
 * polymorphism.
 *  
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ClickableObjectViewDecorators {

    /**
     * Wrapper method for more aesthetic code.
     * 
     * @param {TypeOfOnClickData} decoratorType What kind of decorator to use
     * @param {GameObjectView OR GameMapElementView} viewObject the view to be
     *                                                          decorated
     * @param {Object} creationData object containing all necessary data for
     *                              the decorator to work with. Needs to contain
     *                              the onClickData, the gameObjectId, the type
     *                              of the object and the eventManager
     */
    static decorate(decoratorType, viewObject, creationData) {
        ClickableObjectViewDecorators.DECORATORS[decoratorType](viewObject, creationData)
    }

    static DECORATORS = Object.freeze({
        [TypeOfOnClickData.IFRAME] (viewObject, creationData) {
            const { gameObjectID, eventManager } = creationData
            IFrameViewDecorator.decorate(viewObject, gameObjectID, eventManager)
        },

        [TypeOfOnClickData.STORY] (viewObject, creationData) {
            const { gameObjectID, onClickData: { story }, gameObjectType } = creationData
            StoryViewDecorator.decorate(viewObject, gameObjectID, story, gameObjectType)
        },

        [TypeOfOnClickData.MEETING] (viewObject, creationData) {
            const { gameObjectID, onClickData: { id, domain, name, password }, eventManager } = creationData
            MeetingViewDecorator.decorate(viewObject, gameObjectID, { id, domain, name, password }, eventManager)
        },
        
        [TypeOfOnClickData.SCHEDULE] (viewObject, creationData) {
            const { gameObjectID, eventManager } = creationData
            ScheduleViewDecorator.decorate(viewObject, gameObjectID, eventManager)
        },

        [TypeOfOnClickData.EMPTY] (viewObject, creationData) {
            /* Do nothing. This should never actually be called. */
        },
    })
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ClickableObjectViewDecorators;
}


