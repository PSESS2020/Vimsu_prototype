const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');
const Lecture = require('../models/Lecture')
const Orator = require('../models/Orator')

var vimsudb;
async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class LectureService {
    static getVideo(videoId) {
        TypeChecker.isString(videoId);

        return getDB().then(res => {
            return vimsudb.downloadFile("lectures", videoId);
        }).catch(err => {
            console.error(err)
        });
    }

    static createAllLectures(conferenceId) {
        return getDB().then(res => {
            return this.getAllLectures(conferenceId).then(lectures => {
                var lectureLists = [];

                if(lectures) {
                    var oratorLectureIds = []

                    for(var lecture in lectures) {
                        return this.getOratorLectureIds(lecture.oratorId, conferenceId).then(oratorLectures => {
                            for(var oratorLecture in oratorLectures) {
                                oratorLectureIds.push(oratorLecture.id);
                            }

                            lectureLists.push(new Lecture(lecture.id, lecture.title, lecture.videoId, 
                                lecture.remarks, lecture.startingTime, new Orator(lecture.oratorId, "", "", 
                                oratorLectureIds), lecture.maxParticipants));

                            oratorLectureIds.length = 0;
                        }).catch(err => {
                            console.error(err)
                        })
                    }
                }
                return lectureLists;
                
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAllLectures(conferenceId) {
        return getDB().then(res => {
            return vimsudb.findInCollection("lectures", {conferenceId: conferenceId}, {}).then(lectures => {
                if (lectures.length > 0) {
                    return lectures;
                }
                else {
                    console.log("no lecture found with conferenceId " + conferenceId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    static getOratorLectureIds(oratorId, conferenceId) {
        return getDB().then(res => {
            return vimsudb.findInCollection("lectures", {oratorId: oratorId, conferenceId: conferenceId}, {id: 1}).then(lectures => {
                if (lectures.length > 0) {
                    return lectures;
                }
                else {
                    console.log("no lecture found with oratorId " + oratorId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }
} 