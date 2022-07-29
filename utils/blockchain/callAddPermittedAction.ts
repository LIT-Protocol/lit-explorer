import getIPFSHash, { IPFSHash } from "../ipfs/getIpfsHash";
import throwError from "../throwError";
import getPubkeyRouterAndPermissionsContract from "./getPubkeyRouterAndPermissionsContract";
import getWeb3Wallet from "./getWeb3Wallet";

/**
 * Register Action (from router permission contract)
 */
const callAddPermittedAction = async (ipfsId: string, selectedToken: any) => {

    // -- validate
    if( ! ipfsId || ipfsId == ''){
        throwError("IPFS ID not found.");
        return;
    }
    if( ! selectedToken || selectedToken == ''){
        throwError("PKP not selected.");
        return;
    }

    // -- get wallet
    const { signer } = await getWeb3Wallet();

    const contract = await getPubkeyRouterAndPermissionsContract({ wallet: signer });

    let ipfsHash : IPFSHash = getIPFSHash(ipfsId);

    let permittedAction: any;

    try{
        permittedAction = await contract.addPermittedAction(selectedToken, ipfsHash.digest);
    }catch(e: any){
        throwError(e.message);
    }

    return permittedAction;
}

export default callAddPermittedAction;