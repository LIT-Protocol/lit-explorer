import { readdirSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import { writeToFile } from './util.mjs';

const getFiles = function (dir, files_ = []) {
    readdirSync(dir).forEach(file => {
        files_.push(join(dir, file));
        if (statSync(join(dir, file)).isDirectory()) {
            files_ = getFiles(join(dir, file), files_);
        }
    });
    return files_;
}

const getChecksum = function (dir) {

    const files = getFiles(dir);

    const shasum = createHash('sha1');
    shasum.update(files.join(''));

    return shasum.digest('hex');
}

const checksum = getChecksum('./');

writeToFile(checksum, './public/checksum.txt');

console.log(checksum);