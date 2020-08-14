const FileSystem = require('../../config/FileSystem');
const ObjectId = require('mongodb').ObjectID;
const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Slot = require('../models/Slot')

module.exports = class SlotService {
    static storeVideo(video, vimsudb) {
        var dir = __dirname + "/upload/";

        return FileSystem.moveFile(video, dir).then(res => {
            return vimsudb.uploadFile("lectures", video.name, dir).then(videoData => {
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

    static createSlot(videoId, duration, conferenceId, title, remarks, startingTime, oratorId, maxParticipants, vimsudb) {


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

    static deleteAllVideos(vimsudb) {

        return vimsudb.deleteAllFromCollection("lectures.chunks").then(res => {
            return vimsudb.deleteAllFromCollection("lectures.files").then(res => {
                console.log("all videos deleted");

            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err);
        })

    }

    static deleteVideo(videoId, vimsudb) {
        TypeChecker.isString(videoId);


        return vimsudb.deleteOneFromCollection("lectures.chunks", { videoId: videoId }).then(res => {
            return vimsudb.deleteOneFromCollection("lectures.files", { _id: new ObjectId(videoId) }).then(res => {
                console.log("video with videoId " + videoId + " deleted");

            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err);
        })

    }

    static deleteAllSlots(vimsudb) {
        return vimsudb.deleteAllFromCollection("lectures").then(res => {
            console.log("all slots deleted");
        }).catch(err => {
            console.error(err);
        })
    }

    static deleteSlot(lectureId, vimsudb) {
        return vimsudb.deleteOneFromCollection("lectures", { lectureId: lectureId }).then(res => {
            console.log("slot with lectureId " + lectureId + " deleted");
        }).catch(err => {
            console.error(err);
        })
    }
} 