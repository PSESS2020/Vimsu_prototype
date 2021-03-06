const FileSystem = require('../../config/FileSystem');
const ObjectId = require('mongodb').ObjectID;
const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Slot = require('../models/Slot')
const blobClient = require('../../config/blob');
const db = require('../../config/db');
const { getVideoDurationInSeconds } = require('get-video-duration');

/**
 * The Slot Service
 * @module SlotService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class SlotService {

    /**
     * stores video in the blob storage
     * @static @method module:SlotService#storeVideo
     * 
     * @param {Object} video video data
     * @param {blobClient} blob blob instance
     * 
     * @return {Object|boolean} videoData if successful, otherwise false
     */
    static storeVideo(video, blob) {
        TypeChecker.isInstanceOf(blob, blobClient);

        var dir = __dirname + "/upload/";

        return FileSystem.moveFile(video, dir).then(res => {
            return getVideoDurationInSeconds(FileSystem.createReadStream(dir + video.name)).then(duration => {
                if (duration < 1) {
                    return false;
                } else {
                    return blob.uploadFile("lectures", video.name, dir, 'video/mp4').then(fileId => {
                        FileSystem.deleteDirectory(dir);
                        if (fileId) {
                            return ({
                                fileId: fileId,
                                duration: duration
                            });
                        } else {
                            return false;
                        }
                    })
                }
            })
        })
    }

    /**
     * creates video container in the blob storage
     * @static @method module:SlotService#createVideoContainer
     * 
     * @param {blob} blob blob instance
     */
    static createVideoContainer(blob) {
        return blob.createContainer("lectures");
    }

    /**
     * creates lecture slot and saves it in the database
     * @static @method module:SlotService#createSlot
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

        return vimsudb.insertOneToCollection("lectures", lecture).then(res => {
            if (res.insertedCount > 0) {
                return true;
            } else {
                return false;
            }
        })
    }

    /**
     * deletes video from the blob storage
     * @static @method module:SlotService#deleteVideo
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
     * deletes all lecture slots from the database
     * @static @method module:SlotService#deleteAllSlots
     * 
     * @param {db} vimsudb db instance
     */
    static deleteAllSlots(vimsudb) {
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteAllFromCollection("lectures").then(res => {
            if (res)
                console.log("all slots deleted");
            return res;
        })
    }

    /**
     * deletes a slot from the database
     * @static @method module:SlotService#deleteSlot
     * 
     * @param {String} lectureId lecture ID
     * @param {db} vimsudb db instance
     */
    static deleteSlot(lectureId, vimsudb) {
        TypeChecker.isString(lectureId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteOneFromCollection("lectures", { lectureId: lectureId }).then(res => {
            if (res)
                console.log("slot with lectureId " + lectureId + " deleted");
            
            return res;
        })
    }
} 