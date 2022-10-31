import fetch from 'node-fetch';
import fs from 'fs';

/** ==================== Helper ==================== */
const writeToFile = (data, filename) => {
    fs.writeFile(filename, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Wrote to ${filename}`);
        }
    });
};

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

const runInputOutputs = async ({ IOs, ignoreProperties }) => {
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

/** ==================== Main ==================== */
const INPUT_ROOT = 'https://raw.githubusercontent.com/LIT-Protocol/LitNodeContracts/main/';
const OUTPUT_FOLDER = './ABIs/';

runInputOutputs({
    IOs: [
        {
            input: `${INPUT_ROOT}deployed_contracts_mumbai.json`,
            output: `${OUTPUT_FOLDER}deployed-contracts.json`
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PKPHelper.json`,
            output: `${OUTPUT_FOLDER}PKPHelper.json`
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PKPNFT.json`,
            output: `${OUTPUT_FOLDER}PKPNFT.json`
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PKPPermissions.json`,
            output: `${OUTPUT_FOLDER}PKPPermissions.json`
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PubkeyRouter.json`,
            output: `${OUTPUT_FOLDER}PubKeyRouter.json`
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/RateLimitNFT.json`,
            output: `${OUTPUT_FOLDER}RateLimitNFT.json`
        }
    ],
    ignoreProperties: ["metadata", "bytecode", "deployedBytecode"]
})