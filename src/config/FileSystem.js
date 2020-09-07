const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const TypeChecker = require('../game/app/client/shared/TypeChecker');

/**
 * The File System
 * @module FileSystem
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class FileSystem {

    /**
     * creates a directory if not exists
     * @static @method module:FileSystem#createDirectory
     * 
     * @param {String} dir directory
     */
    static createDirectory(dir) {
        TypeChecker.isString(dir);
        mkdirp.sync(dir);
    }

    /**
     * deletes a directory with its content
     * @static @method module:FileSystem#deleteDirectory
     * 
     * @param {String} dir directory
     */
    static deleteDirectory(dir) {
        TypeChecker.isString(dir);

        rimraf(dir, function () {
            console.log(`${dir} directory is deleted`);
        });
    }

    /**
     * moves file to a directory
     * @static @method module:FileSystem#moveFile
     * 
     * @param {Object} file file to be moved
     * @param {String} dir directory to which file should be moved
     * 
     * @return {boolean} true if successfully moved, otherwise error
     */
    static moveFile(file, dir) {
        TypeChecker.isString(dir);

        return new Promise((resolve, reject) => {
            this.createDirectory(dir);

            file.mv(dir + file.name, function (err) {
                if (err)
                    reject(err);
                else
                    resolve(true);
            })
        })
    }

    /**
     * reads file
     * @static @method module:FileSystem#createReadStream
     * 
     * @param {String} filePath file path
     */
    static createReadStream(filePath) {
        TypeChecker.isString(filePath);
        return fs.createReadStream(filePath);
    }
}
