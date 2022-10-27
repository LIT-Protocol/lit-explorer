import fetch from 'node-fetch';
import fs from 'fs';

/** ==================== Config ==================== */
const URL = 'https://raw.githubusercontent.com/LIT-Protocol/LitNodeContracts/main/deployed-contracts.json';

const OUTPUT_CONTRACT_ADDRESSES = './ABIs/deployed-contracts.json';

/** ==================== Helper ==================== */
// write to a file
const writeToFile = (data, filename) => {
    fs.writeFile(filename, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Wrote to ${filename}`);
        }
    });
};

/** ==================== Main ==================== */
const data = await fetch(URL).then((res) => res.json());

writeToFile(JSON.stringify(data, null, 2), OUTPUT_CONTRACT_ADDRESSES);