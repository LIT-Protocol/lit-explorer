import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ethers } from "ethers";

/**
 * Get PKPNFT Contract
 * https://celoscan.io/address/0x0008a7b1ce657e78b4edc6fc40078ce8bf08329a#readContract
 * @returns 
 */
const getPKPNFTContract = async (): Promise <Contract> =>  {
    
    const provider = new CeloProvider(process.env.NEXT_PUBLIC_CHAIN_RPC);

    await provider.ready;

    const wallet = new CeloWallet(ethers.Wallet.createRandom().privateKey, provider)

    const ABI = require('../../abi/pkp_nft.json').result;

    const contractAddressHash = process.env.NEXT_PUBLIC_PKP_NFT_CONTRACT || '';

    return new ethers.Contract(contractAddressHash, ABI, wallet);

}

export default getPKPNFTContract;