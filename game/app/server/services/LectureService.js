const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');

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
    static getVideo(fileName) {
        TypeChecker.isString(fileName);
        
        return getDB().then(res => {
            return vimsudb.downloadFile("lectures", fileName);
        }).catch(err => {
            console.error(err)
        });
    }
} 