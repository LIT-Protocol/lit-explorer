import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ethers } from "ethers";

interface Props{
    wallet?: any 
}

/**
 * Get PubkeyRouterAndPermissions Contract
 * https://celoscan.io/address/0x5Ef8A5e3b74DE013d608740F934c14109ae12a81#readContract
 * @returns 
 */
const getPubkeyRouterAndPermissionsContract = async (props?: Props): Promise <Contract> =>  {
    
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

    const ABI = require('../../abi/pkp_router.json').result;

    const contractAddressHash = process.env.NEXT_PUBLIC_PKP_ROUTER_CONTRACT || '';

    return new ethers.Contract(contractAddressHash, ABI, wallet);

}

export default getPubkeyRouterAndPermissionsContract;