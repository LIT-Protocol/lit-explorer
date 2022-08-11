import { NextRouter } from "next/router";
import { ROUTES, SupportedSearchTypes } from "../app_config";
import * as isIPFS from 'is-ipfs';

export class AppRouter{

    /**
     * Get the search type from a string
     * 
     * @example
     *   IPFS ID: QmesxxB4NgrwGW1NZBRrbPj95NJL37aZj7Jcbnw2LVQjAW
     *   ETH Address: 0xC285BBcd9d79225E1a08699Ae355d9C52F58a6c7
     *   Token ID: 3096635843933936779942875635488849512907
     * 
     * @param { SupportedSearchTypes } text
     * 
     * @returns { string } type
     */
    static getSearchType = (text: string) : SupportedSearchTypes | never => {

        console.log("[getSearchType] input<text>:", text);

        if(parseInt(text) < 99999){
            return SupportedSearchTypes.RLI_TOKEN_ID
        }

        if( text?.includes('0x') ){
            return SupportedSearchTypes.ETH_ADDRESS;
        }
    
        if( ! text?.includes('0x') && (parseInt(text).toString()) !== 'NaN'){
            return SupportedSearchTypes.PKP_TOKEN_ID;
        }
    
        if( isIPFS.multihash(text) ){
            return SupportedSearchTypes.IPFS_ID;
        }
    
        throw new Error(`search type "${text}" not found.`);
    
    }

    /**
     * Get page route by id
     * 
     * @param { string } id could be ipfsId, eth address or token id
     * 
     * @return { string } the full path of the 
     */
    static getPage = (id: string) : string => {
    
        let type : SupportedSearchTypes | never = AppRouter.getSearchType(id);
    
        // -- validate
        if( type === null ) throw new Error(`search type is null`);
    
        // -- execute
        return ROUTES[type].getRoute(id);
    }

}