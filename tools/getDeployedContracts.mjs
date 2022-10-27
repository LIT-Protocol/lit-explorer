// import fetch for node
import fetch from 'node-fetch';

// import fs
import fs from 'fs';

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


const url = 'https://raw.githubusercontent.com/LIT-Protocol/LitNodeContracts/main/deployed-contracts.json';

const data = await fetch(url).then((res) => res.json());

console.log("data:", data)

writeToFile(JSON.stringify(data, null, 2), './ABIs/deployed-contracts.json');