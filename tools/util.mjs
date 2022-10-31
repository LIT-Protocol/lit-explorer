import fs from 'fs';
import fetch from 'node-fetch';

/** ==================== Helper ==================== */
export const writeToFile = (data, filename) => {
    fs.writeFile(filename, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Wrote to ${filename}`);
        }
    });
};

export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const runInputOutputs = async ({ IOs, ignoreProperties }) => {
    await asyncForEach(IOs, async (item) => {
        const data = await fetch(item.input).then((res) => res.text());
    
        const json = JSON.parse(data);
    
        await asyncForEach(Object.keys(json), async (key) => {
            if (ignoreProperties.includes(key)) {
                delete json[key];
            }
        });
    
        writeToFile(JSON.stringify(json, null, 2), item.output);
    })
}