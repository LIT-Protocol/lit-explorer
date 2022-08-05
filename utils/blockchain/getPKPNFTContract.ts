import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ethers } from "ethers";
import { APP_CONFIG } from "../../app_config";

/**
 * Get PKPNFT Contract
 * https://celoscan.io/address/0x0008a7b1ce657e78b4edc6fc40078ce8bf08329a#readContract
 * @returns 
 */
const getPKPNFTContract = async (signer?: any): Promise <Contract> =>  {

    let wallet;

    if(! signer ){
        const provider = new CeloProvider(process.env.NEXT_PUBLIC_CHAIN_RPC);
    
        await provider.ready;
    
        wallet = new CeloWallet(ethers.Wallet.createRandom().privateKey, provider)
    }else{
        wallet = signer;
    }
    

    const ABI = require('../../abi/pkp_nft.json').result;

    const contractAddressHash = APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS || '';

    return new ethers.Contract(contractAddressHash, ABI, wallet);

}

export default getPKPNFTContract;