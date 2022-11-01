import { runInputOutputs } from './util.mjs';

/** ==================== Main ==================== */
const INPUT_ROOT = 'https://raw.githubusercontent.com/LIT-Protocol/LitNodeContracts/main/';
const OUTPUT_FOLDER = './ABIs/';

runInputOutputs({
    IOs: [
        {
            input: `${INPUT_ROOT}deployed_contracts_mumbai.json`,
            output: `${OUTPUT_FOLDER}deployed-contracts.json`,
            mappedKey: null,
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PKPHelper.json`,
            output: `${OUTPUT_FOLDER}PKPHelper.json`,
            mappedKey: 'pkpHelperContractAddress',
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PKPNFT.json`,
            output: `${OUTPUT_FOLDER}PKPNFT.json`,
            mappedKey: 'pkpNftContractAddress',
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PKPPermissions.json`,
            output: `${OUTPUT_FOLDER}PKPPermissions.json`,
            mappedKey: 'pkpPermissionsContractAddress',
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/PubkeyRouter.json`,
            output: `${OUTPUT_FOLDER}PubKeyRouter.json`,
            mappedKey: 'pubkeyRouterContractAddress',
        },
        {
            input: `${INPUT_ROOT}deployments/mumbai_80001/RateLimitNFT.json`,
            output: `${OUTPUT_FOLDER}RateLimitNFT.json`,
            mappedKey: 'rateLimitNftContractAddress',
        }
    ],
    ignoreProperties: ["metadata", "bytecode", "deployedBytecode"]
})