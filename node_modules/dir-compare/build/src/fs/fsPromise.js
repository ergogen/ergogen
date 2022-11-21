const fs = require('fs');
module.exports = {
    readdir(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(files);
                }
            });
        });
    },
    read(fd, buffer, offset, length, position) {
        return new Promise((resolve, reject) => {
            fs.read(fd, buffer, offset, length, position, (err, bytesRead) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(bytesRead);
                }
            });
        });
    },
};
//# sourceMappingURL=fsPromise.js.map