var db;

module.exports.setDB = function(database) {
    db = database;
    console.log("set " + db + " success");
}

module.exports.getDB = function() {
    setTimeout(function(){ 
        console.log(db); 
        return db;
    }, 1500);
}
