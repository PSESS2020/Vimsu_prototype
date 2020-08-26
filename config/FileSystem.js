const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const TypeChecker = require('../game/app/client/shared/TypeChecker');

module.exports = class FileSystem {

    /**
     * 
     * @param {String} dir 
     */
    static createDirectory(dir) {
        TypeChecker.isString(dir);
        mkdirp.sync(dir);
    }

    /**
     * 
     * @param {String} dir 
     */
    static deleteDirectory(dir) {
        TypeChecker.isString(dir);

        rimraf(dir, function () { 
            console.log(`${dir} directory is deleted`); 
        });
    }

    /**
     * 
     * @param {Object} file 
     * @param {String} dir 
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
     * 
     * @param {String} filePath 
     */
    static createReadStream(filePath) {
        TypeChecker.isString(filePath);
        return fs.createReadStream(filePath);
    }
}
