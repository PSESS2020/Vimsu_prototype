const dbconf = require('../../config/dbconf');
const FileSystem = require('../../config/FileSystem');
const ObjectId = require('mongodb').ObjectID;
const TypeChecker = require('../../game/app/utils/TypeChecker');
const Slot = require('../models/Slot')

var vimsudb;
async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class SlotService {
    static storeVideo(video) {
        var dir = __dirname + "/upload/";
        
        return FileSystem.moveFile(video, dir).then(res => {
            return getDB().then(res => {
                return vimsudb.uploadFile("lectures", video.name, dir).then(res => {
                    FileSystem.deleteDirectory(dir);
                    return res;
                }).catch(err => {
                    console.error(err)
                })
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static createSlot(videoId, conferenceId, title, remarks, startingTime, oratorId, maxParticipants) {
        return getDB().then(res => {
    
            var id = new ObjectId().toString();
            var slot = new Slot(title, conferenceId, videoId, remarks, startingTime, oratorId, maxParticipants);
            slot.setId(id);

            var lecture = {
                id: id,
                videoId: videoId,
                conferenceId: conferenceId,
                title: title,
                remarks: remarks,
                startingTime: startingTime,
                oratorId: oratorId,
                maxParticipants: maxParticipants
            }

            return vimsudb.insertOneToCollection("lectures", lecture).then(res => {
                console.log("lecture saved")
            }).catch(err => {
                console.error(err)  
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static deleteAllVideos() {
        return getDB().then(res => {
            return vimsudb.deleteAllFromCollection("lectures.chunks").then(res => {
                return vimsudb.deleteAllFromCollection("lectures.files").then (res => {
                    console.log("all videos deleted");
                }).catch(err => {
                    console.error(err)
                })
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    static deleteVideo(videoId) {
        TypeChecker.isString(videoId);

        return getDB().then(res => {
            return vimsudb.deleteOneFromCollection("lectures.chunks", {videoId: videoId}).then(res => {
                return vimsudb.deleteOneFromCollection("lectures.files", {_id: new ObjectId(videoId)}).then (res => {
                    console.log("video with videoId " + videoId + " deleted");
                }).catch(err => {
                    console.error(err)
                })
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }
} 