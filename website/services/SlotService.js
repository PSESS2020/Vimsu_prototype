const TypeChecker = require('../../game/app/utils/TypeChecker')
const dbconf = require('../../config/dbconf');

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
    static storeVideo(fileName) {
        TypeChecker.isString(fileName);
        
        return getDB().then(res => {
            return vimsudb.uploadFile("lectures", fileName);
        }).catch(err => {
            console.error(err)
        });
    }
} 