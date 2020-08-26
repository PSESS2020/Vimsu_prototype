const TypeChecker = require('../../client/shared/TypeChecker.js');
const Lecture = require('../models/Lecture');
const blobClient = require('../../../../config/blob');
const db = require('../../../../config/db');

module.exports = class LectureService {

    /**
     * 
     * @param {String} videoId 
     * @param {blobClient} blob 
     * @param {Date} startingTime 
     * @param {number} duration 
     */
    static getVideoUrl(videoId, blob, startingTime, duration) {
        TypeChecker.isString(videoId);
        TypeChecker.isInstanceOf(blob, blobClient);
        TypeChecker.isDate(startingTime);
        TypeChecker.isNumber(duration);

        return blob.getWriteSAS("lectures", videoId, startingTime, duration);
    }
    
    /**
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static createAllLectures(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return this.#getAllLecturesWithOratorData(conferenceId, vimsudb).then(lectures => {
            var lectureLists = [];

            if (lectures) {
                for (var i = 0; i < lectures.length; i++) {
                    var orator = lectures[i].accountsData[0];
                    lectureLists.push(new Lecture(lectures[i].lectureId, lectures[i].title, lectures[i].videoId, lectures[i].duration,
                        lectures[i].remarks, lectures[i].startingTime, orator.title + " " + orator.forename + " " + orator.surname, orator.username, lectures[i].maxParticipants));
                }
            }
            return lectureLists;

        }).catch(err => {
            console.error(err)
        })
    }

    /**
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static getAllLectures(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

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

    /**
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static #getAllLecturesWithOratorData = function(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

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
} 