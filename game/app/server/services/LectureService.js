const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');
const Lecture = require('../models/Lecture')

var vimsudb = dbconf.getDB();

module.exports = class LectureService {
    static getVideo(videoId) {
        TypeChecker.isString(videoId);

        return vimsudb.downloadFile("lectures", videoId).then(res => {
            return res;
        }).catch(err => {
            console.error(err)
        });

    }


    static createAllLectures(conferenceId) {
        return this.getAllLecturesWithOratorData(conferenceId).then(lectures => {
            var lectureLists = [];

            if (lectures) {
                for (var i = 0; i < lectures.length; i++) {
                    var orator = lectures[i].accountsData[0];
                    lectureLists.push(new Lecture(lectures[i].id, lectures[i].title, lectures[i].videoId, lectures[i].duration,
                        lectures[i].remarks, lectures[i].startingTime, orator.title + " " + orator.forename + " " + orator.surname, lectures[i].maxParticipants));
                }
            }
            return lectureLists;

        }).catch(err => {
            console.error(err)
        })
    }

    static getAllLectures(conferenceId) {
        return vimsudb.findInCollection("lectures", { conferenceId: conferenceId, isAccepted: true }, {}).then(lectures => {
            if (lectures.length > 0) {
                return lectures;
            }
            else {
                console.log("no accepted lecture found with conferenceId " + conferenceId);
                return false;
            }

        })
    }

    static getAllLecturesWithOratorData(conferenceId) {

        return vimsudb.joinCollection("lectures", "accounts", "oratorId", "accountId").then(allLectures => {
            if (allLectures.length > 0) {
                var lectures = [];

                for (var i = 0; i < allLectures.length; i++) {
                    if (allLectures[i].conferenceId == conferenceId && allLectures[i].isAccepted == true) {
                        lectures.push(allLectures[i]);
                    }
                }

                if (lectures.length > 0)
                    return lectures;
                else {
                    console.log("no lecture found with conferenceId " + conferenceId);
                    return false;
                }
            }
            else {
                console.log("no lecture found in database");
                return false;
            }

        })

    }

    static getOratorLectureIds(oratorId, conferenceId) {
        return vimsudb.findInCollection("lectures", { oratorId: oratorId, conferenceId: conferenceId, isAccepted: true }, { id: 1 }).then(lectures => {

            if (lectures.length > 0) {
                return lectures;
            }
            else {
                console.log("no lecture found with oratorId " + oratorId);
                return false;
            }
        })
    }
} 