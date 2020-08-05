const FileSystem = require('../../config/FileSystem');
const ObjectId = require('mongodb').ObjectID;
const TypeChecker = require('../../game/app/utils/TypeChecker');
const Slot = require('../models/Slot')

module.exports = class SlotService {
    static storeVideo(video, vimsudb) {
        var dir = __dirname + "/upload/";
        
        return FileSystem.moveFile(video, dir).then(res => {

                return vimsudb.uploadFile("lectures", video.name, dir).then(videoData => {
                    FileSystem.deleteDirectory(dir);
                    if(videoData) {
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
            var slot = new Slot(title, conferenceId, videoId, remarks, startingTime, oratorId, maxParticipants);
            slot.setId(id);

            var lecture = {
                id: id,
                videoId: videoId,
                duration: duration,
                conferenceId: conferenceId,
                title: title,
                remarks: remarks,
                startingTime: startingTime,
                oratorId: oratorId,
                maxParticipants: maxParticipants,
                isAccepted: false
            }

            return vimsudb.insertOneToCollection("lectures", lecture).then(res => {
                console.log("lecture saved")

            }).catch(err => {
                console.error(err)  
            })

    }

    static deleteAllVideos(vimsudb) {

            return vimsudb.deleteAllFromCollection("lectures.chunks").then(res => {
                return vimsudb.deleteAllFromCollection("lectures.files").then (res => {
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


            return vimsudb.deleteOneFromCollection("lectures.chunks", {videoId: videoId}).then(res => {
                return vimsudb.deleteOneFromCollection("lectures.files", {_id: new ObjectId(videoId)}).then (res => {
                    console.log("video with videoId " + videoId + " deleted");

                }).catch(err => {
                    console.error(err)
                })
            }).catch(err => {
                console.error(err);
            })

    }
} 