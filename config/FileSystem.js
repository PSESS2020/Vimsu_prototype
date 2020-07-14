const fs = require('fs');
const mkdirp = require('mkdirp')

module.exports = class FileSystem {

    static createDirectory(dir) {
        mkdirp.sync(dir);
    }

    static deleteDirectory(dir) {
        fs.rmdir(dir, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
            console.log(`${dir} is deleted!`);
        });
    }

    static moveFile(file, dir) {
        return new Promise((resolve, reject) => {
            this.createDirectory(dir);

            file.mv(dir + file.name, function(err) {
                if (err)
                    reject(err);
                else
                    resolve(true);
            })
        })
    }
}
