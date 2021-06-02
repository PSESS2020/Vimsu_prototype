/**
 * @enum on click data type
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const TypeOfOnClickData = Object.freeze({
    IFRAME: "iFrameData",
    STORY: "StoryData",
    MEETING: "MeetingData",
    SCHEDULE: "isSchedule",
    EMPTY: "EMPTY",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeOfOnClickData;
}