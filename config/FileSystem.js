const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

module.exports = class FileSystem {

    static createDirectory(dir) {
        mkdirp.sync(dir);
    }

    static deleteDirectory(dir) {
        rimraf(dir, function () { 
            console.log(`${dir} directory is deleted`); 
        });
    }

    static moveFile(file, dir) {
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

    static createReadStream(filePath) {
        return fs.createReadStream(filePath);
    }
}
