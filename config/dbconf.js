const db = require('./db');

var vimsudb;
var database = new db();

module.exports.getDB = function() {
    console.log(vimsudb); 
    return vimsudb;
}

module.exports.setDB = async() => {
        return database.connectDB().then(result => {
                vimsudb = database;
                console.log("set " + vimsudb + " success")
        }).catch(err => {
                console.error(err);
        })
}