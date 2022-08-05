import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ethers } from "ethers";

interface Props{
    wallet?: any 
}

/**
 * Get Rate Limit NFT Contract
 * https://celoscan.io/address/0x5f8c001Edb1Af78504E624BE3A0836C2659c02Dd#readContract
 * @returns 
 */
const getRateLimitContract = async (props?: Props): Promise <Contract> =>  {
    
    let wallet;

    // If wallet is provider
    if(props?.wallet){
        wallet = props.wallet; 
    }
    
    // Randomly generate a wallet to read blockchain info
    else{
        const provider = new CeloProvider(process.env.NEXT_PUBLIC_CHAIN_RPC);
    
        await provider.ready;
    
        wallet =  new CeloWallet(ethers.Wallet.createRandom().privateKey, provider)
    }

    const ABI = require('../../abi/pkp_rate_limit.json').result;

    const contractAddressHash = process.env.NEXT_PUBLIC_PKP_RATE_LIMIT_CONTRACT || '';

    return new ethers.Contract(contractAddressHash, ABI, wallet);

}

export default getRateLimitContract;