const FileSystem = require('../../config/FileSystem');
const ObjectId = require('mongodb').ObjectID;
const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Slot = require('../models/Slot')
const blobClient = require('../../config/blob');
const db = require('../../config/db');

module.exports = class SlotService {

    /**
     * @static stores video in the blob storage
     * 
     * @param {Object} video video data
     * @param {blobClient} blob blob instance
     * 
     * @return videoData if successful, otherwise false
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
     * @static creates lecture slot and saves it in the database
     * 
     * @param {String} videoId video ID
     * @param {number} duration video duration
     * @param {String} conferenceId lecture conference ID
     * @param {String} title lecture title
     * @param {String} remarks lecture remarks
     * @param {Date} startingTime lecture starting time
     * @param {String} oratorId lecture orator ID
     * @param {number} maxParticipants lecture max participants
     * @param {db} vimsudb db instance
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
     * @static deletes video from the blob storage
     * 
     * @param {String} videoId video ID
     * @param {blobClient} blob blob instance
     */
    static deleteVideo(videoId, blob) {
        TypeChecker.isString(videoId);
        TypeChecker.isInstanceOf(blob, blobClient);

        return blob.deleteFile("lectures", videoId);
    }

    /**
     * @static deletes all lecture slots from the database
     * 
     * @param {db} vimsudb db instance
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
     * @static deletes a slot from the database
     * 
     * @param {String} lectureId lecture ID
     * @param {db} vimsudb db instance
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