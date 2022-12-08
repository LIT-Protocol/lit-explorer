import { exit } from 'process';
import { childRunCommand, getArgs, greenLog, readFile, writeFile } from './utils.mjs'

const args = getArgs();

const OPTION = args[0];

if (!OPTION || OPTION === '' || OPTION === '--help') {
    greenLog(`
        Usage: node tools/tools.mjs [option][...args]
        Options:
            --help: show this help
            --publish: publish to npm
            --fetch-contracts: fetch contracts from github
            --fetch-demos: fetch demos from github
    `, true);
    exit();
}

if (OPTION === '--publish') {

    const ENV = args[1];

    if (!ENV || ENV === '' || ENV === '--help') {
        greenLog(`
            Usage: node tools/tools.mjs --publish [env]
            Envs:
                serrano: publish to explorer.litprotocol.com
                collabland: publish to mumbai.explorer.litprotocol.com
        `, true);
        exit();
    }

    if (ENV === 'serrano') {
        greenLog('Switching to explorer.litprotocol.com', true);

        const fileContent = await readFile('./tools/getDeployedContracts.mjs');

        const newFileContent = fileContent.replace('const CURRENT = COLLABLAND;', 'const CURRENT = SERRANO;');

        await writeFile('./tools/getDeployedContracts.mjs', newFileContent);

    }

    if( ENV === 'collabland') {
        greenLog('Switching to mumbai.explorer.litprotocol.com', true);

        const fileContent = await readFile('./tools/getDeployedContracts.mjs');

        const newFileContent = fileContent.replace('const CURRENT = SERRANO;', 'const CURRENT = COLLABLAND;');

        await writeFile('./tools/getDeployedContracts.mjs', newFileContent);
    }

    await childRunCommand('yarn build');
    exit();
}

if( OPTION === '--fetch-contracts'){
    await childRunCommand('node tools/getDeployedContracts.mjs');
    exit();
}

if( OPTION === '--fetch-demos'){
    await childRunCommand('node tools/getServerlessFunctionTest.mjs');
    exit();
}