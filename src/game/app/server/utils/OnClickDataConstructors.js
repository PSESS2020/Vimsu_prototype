const TypeOfOnClickData = require("../../client/shared/TypeOfOnClickData")
const OnClickEmptyData = require("../models/onclickdatatypes/OnClickEmptyData")
const OnClickIFrameData = require("../models/onclickdatatypes/OnClickIFrameData")
const OnClickStoryData = require("../models/onclickdatatypes/OnClickStoryData")
const OnClickMeetingData = require("../models/onclickdatatypes/OnClickMeetingData")
const OnClickScheduleData = require("../models/onclickdatatypes/OnClickScheduleData")
const Settings = require("./Settings")

/**
 * @module OnClickDataConstructors
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class OnClickDataConstructors {
    static [TypeOfOnClickData.IFRAME] (data) {
        const { title, width, height, url } = data
        return new OnClickIFrameData(title, width, height, url)
    }

    static [TypeOfOnClickData.STORY] (data) {
        return new OnClickStoryData(data)
    }

    static [TypeOfOnClickData.MEETING] (data) {
        const { name, domain } = data
        return new OnClickMeetingData(name, domain)
    }

    static [TypeOfOnClickData.SCHEDULE] (data) {
        TypeChecker.isBoolean(data)
        if (data && Settings.VIDEOSTORAGE_ACTIVATED) { 
            return new OnClickScheduleData() 
        }
        else { 
            if (Settings.VIDEOSTORAGE_ACTIVATED) { return new OnClickEmptyData() } 
            else { throw new Error("You added an object to the floorplan that was supposed to open the schedule when clicked, but video storage isn't activated for this conference.") }
        }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickDataConstructors
}