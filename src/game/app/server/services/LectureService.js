const TypeChecker = require('../../client/shared/TypeChecker.js');
const Lecture = require('../models/Lecture');
const blobClient = require('../../../../config/blob');
const db = require('../../../../config/db');

/**
 * The Lecture Service
 * @module LectureService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class LectureService {

    /**
     * @static Gets lecture video URL
     * @method module:LectureService#getVideoUrl
     * 
     * @param {String} videoId video ID
     * @param {blobClient} blob blob instance
     * @param {Date} startingTime lecture starting time
     * @param {number} duration lecture video duration
     */
    static getVideoUrl(videoId, blob, startingTime, duration) {
        TypeChecker.isString(videoId);
        TypeChecker.isInstanceOf(blob, blobClient);
        TypeChecker.isDate(startingTime);
        TypeChecker.isNumber(duration);

        return blob.getWriteSAS("lectures", videoId, startingTime, duration);
    }

    /**
     * @static Creates a lecture instance for all accepted lectures stored in the database
     * @method module:LectureService#createAllLectures
     * 
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Lecture[]} array of Lecture instance
     */
    static createAllLectures(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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
     * @static Gets all lectures from the database
     * @method module:LectureService#getAllLectures
     * 
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Lectures[] | boolean} lectures array if lectures found, otherwise false
     */
    static getAllLectures(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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
     * @static @private gets all lectures with the orator personal data from the database
     * @method module:LectureService#getAllLecturesWithOratorData
     * 
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Lectures[] | boolean} lectures array if lectures found, otherwise false
     */
    static #getAllLecturesWithOratorData = function (conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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