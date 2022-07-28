import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ethers } from "ethers";


/**
 * Get PubkeyRouterAndPermissions Contract
 * @returns 
 */
const getPubkeyRouterAndPermissionsContract = async (): Promise <Contract> =>  {
    
    const provider = new CeloProvider(process.env.NEXT_PUBLIC_CHAIN_RPC);
    await provider.ready;

    const wallet = new CeloWallet(ethers.Wallet.createRandom().privateKey, provider)

    const ABI = require('../../abi/pkp_router.json').result;

    const contractAddressHash = process.env.NEXT_PUBLIC_PKP_ROUTER_CONTRACT || '';

    return new ethers.Contract(contractAddressHash, ABI, wallet);

}

export default getPubkeyRouterAndPermissionsContract;