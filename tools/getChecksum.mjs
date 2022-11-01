// create a single hash of all files in a directory
// this is used to check if the files have changed
// and if the cache needs to be updated
// this is a very simple hash, it is not cryptographically secure
// it is only used to check if the files have changed

import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

export default async function getChecksum(dir) {
    const files = await fs.readdir(dir);
    const hash = createHash('sha1');
    for (const file of files) {
        const data = await fs.readFile(join(dir, file));
        hash.update(data);
    }
    return hash.digest('hex');
    }

// Path: tools/getChecksum.mjs

getChecksum('./').then(console.log);