const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const TypeChecker = require('../game/app/client/shared/TypeChecker');

module.exports = class FileSystem {

    /**
     * @static create a directory if not exists
     * 
     * @param {String} dir directory
     */
    static createDirectory(dir) {
        TypeChecker.isString(dir);
        mkdirp.sync(dir);
    }

    /**
     * @static delete a directory with its content
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
     * @static moves file to a directory
     * 
     * @param {Object} file file to be moved
     * @param {String} dir directory to which file should be moved
     * 
     * @return true if successfully moved, otherwise error
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
     * @static reads file
     * 
     * @param {String} filePath file path
     */
    static createReadStream(filePath) {
        TypeChecker.isString(filePath);
        return fs.createReadStream(filePath);
    }
}
