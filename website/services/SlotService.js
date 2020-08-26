const FileSystem = require('../../config/FileSystem');
const ObjectId = require('mongodb').ObjectID;
const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Slot = require('../models/Slot')
const blobClient = require('../../config/blob');
const db = require('../../config/db');

module.exports = class SlotService {

    /**
     * 
     * @param {Object} video 
     * @param {blobClient} blob 
     */
    static storeVideo(video, blob) {
        TypeChecker.isInstanceOf(blob, blobClient);

        var dir = __dirname + "/upload/";

        return FileSystem.moveFile(video, dir).then(res => {
            return blob.uploadFile("lectures", video.name, dir).then(videoData => {
                FileSystem.deleteDirectory(dir);
                if (videoData) {
                    return videoData;
                } else {
                    return false;
                }
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * 
     * @param {String} videoId 
     * @param {number} duration
     * @param {String} conferenceId
     * @param {String} title 
     * @param {String} remarks 
     * @param {Date} startingTime 
     * @param {String} oratorId
     * @param {number} maxParticipants 
     * @param {db} vimsudb
     */
    static createSlot(videoId, duration, conferenceId, title, remarks, startingTime, oratorId, maxParticipants, vimsudb) {
        TypeChecker.isString(title);
        TypeChecker.isString(videoId);
        TypeChecker.isNumber(duration);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(remarks);
        TypeChecker.isDate(startingTime);
        TypeChecker.isString(oratorId);
        TypeChecker.isInt(maxParticipants);
        TypeChecker.isInstanceOf(vimsudb, db);

        var id = new ObjectId().toString();
        var slot = new Slot(id, title, conferenceId, videoId, duration, remarks, startingTime, oratorId, maxParticipants);

        var lecture = {
            lectureId: slot.getId(),
            videoId: slot.getVideoId(),
            duration: slot.getDuration(),
            conferenceId: slot.getConferenceId(),
            title: slot.getTitle(),
            remarks: slot.getRemarks(),
            startingTime: slot.getStartingTime(),
            oratorId: slot.getOratorId(),
            maxParticipants: slot.getMaxParticipants(),
            isAccepted: false
        }

        return vimsudb.insertOneToCollection("lectures", lecture)
            .catch(err => {
                console.error(err)
            })
    }

    /**
     * 
     * @param {String} videoId
     * @param {blobClient} blob 
     */
    static deleteVideo(videoId, blob) {
        TypeChecker.isString(videoId);
        TypeChecker.isInstanceOf(blob, blobClient);

        return blob.deleteFile("lectures", videoId);
    }

    /**
     * 
     * @param {db} vimsudb 
     */
    static deleteAllSlots(vimsudb) {
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteAllFromCollection("lectures").then(res => {
            console.log("all slots deleted");
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * 
     * @param {String} lectureId 
     * @param {db} vimsudb 
     */
    static deleteSlot(lectureId, vimsudb) {
        TypeChecker.isString(lectureId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteOneFromCollection("lectures", { lectureId: lectureId }).then(res => {
            console.log("slot with lectureId " + lectureId + " deleted");
        }).catch(err => {
            console.error(err);
        })
    }
} 