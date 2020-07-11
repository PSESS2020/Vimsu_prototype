var db;

module.exports.setDB = async(database) => {
    db = database;
    console.log("set " + db + " success");
}

module.exports.getDB = function() {

    console.log(db); 
    return db;
}
