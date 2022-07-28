import * as isIPFS from 'is-ipfs';

export enum SearchTypes {
    ETH_ADDRESS = "ETH_ADDRESS",
    IPFS_ID = "IPFS_ID",
    PKP_TOKEN_ID = "PKP_TOKEN_ID"
}

/**
 * Get the search type from a string
 * 
 * @example
 *   IPFS ID: QmesxxB4NgrwGW1NZBRrbPj95NJL37aZj7Jcbnw2LVQjAW
 *   ETH Address: 0xC285BBcd9d79225E1a08699Ae355d9C52F58a6c7
 *   Token ID: 3096635843933936779942875635488849512907
 * 
 * @param text 
 * @returns { string } type
 */
    const getSearchType = (text: string) => {
    
    if( text.includes('0x') ){
        return SearchTypes.ETH_ADDRESS;
    }

    if( ! text.includes('0x') && (parseInt(text).toString()) !== 'NaN'){
        return SearchTypes.PKP_TOKEN_ID;
    }

    if( isIPFS.multihash(text) ){
        return SearchTypes.IPFS_ID;
    }
    
    return null;

    }

      export default getSearchType;