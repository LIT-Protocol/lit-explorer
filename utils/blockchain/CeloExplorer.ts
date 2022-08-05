import { SupportedNetworks, SUPPORTED_CHAINS } from "../../app_config";

/**
 * Parse the return from the returned data calling the API endpoint
 * @param { Response } res 
 * @returns { any } 
 */
export const parseReturnedData = async (res: Response) : Promise<any> => {

    const result = await res.json().then((data) => data.result);
    
    return result;

}

export class CeloFetch {

    api: string;

    constructor(api: string){
        this.api = api;
    }
    
    // (NOT USED)
    // /**
    //  * Get the latest block of the CELO network
    //  * @returns 
    //  */
    // latestBlock = async () => {
        
    //     const res = await fetch(`${this.api}}?module=block&action=eth_block_number`);

    //     const data = await parseReturnedData(res);

    //     const latestBlock = parseInt(data);

    //     return latestBlock;

    // }

}

export class CeloExplorer{

    fetch : CeloFetch;

    constructor(){
        const chain = SUPPORTED_CHAINS[SupportedNetworks.CELO_MAINNET];
        this.fetch = new CeloFetch(chain.EXPLORER_API);
    }

    static txLink = (hash: string) : string => {
        return `https://celoscan.io/tx/${hash}`;
    }

}