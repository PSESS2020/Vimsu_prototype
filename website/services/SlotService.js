const TypeChecker = require('../../game/app/utils/TypeChecker')
const dbconf = require('../../config/dbconf');
const FileSystem = require('../../config/FileSystem')

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
        var dir = "./upload/lectures/";
        
        return FileSystem.moveFile(video, dir).then(res => {
            return getDB().then(res => {
                return vimsudb.uploadFile("lectures", video.name, dir);
            })
        }).catch(err => {
            console.error(err)
        });
    }
} 