const fs = require('fs');

module.exports = class FileSystem {

    static createDirectory(dir) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }

    static deleteFile(filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err)
            }
        })
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
