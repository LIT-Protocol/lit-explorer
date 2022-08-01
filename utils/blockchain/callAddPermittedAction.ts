import { getBytes32FromMultihash, IPFSHash, ipfsIdToIpfsIdHash } from "../ipfs/getIpfsHash";
import throwError from "../throwError";
import getPubkeyRouterAndPermissionsContract from "./getPubkeyRouterAndPermissionsContract";
import getWeb3Wallet from "./getWeb3Wallet";

/**
 * Register Action (from router permission contract)
 */
const callAddPermittedAction = async (ipfsId: string, selectedToken: any) => {

    console.log("[callAddPermittedAction] ipfsId:", ipfsId);
    console.log("[callAddPermittedAction]selectedToken :", selectedToken);

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

    let ipfsHash : IPFSHash = getBytes32FromMultihash(ipfsId);

    let ipfsMultiHash = ipfsIdToIpfsIdHash(ipfsId);

    console.log("ipfsHash:", ipfsHash);
    console.log("ipfsMultiHash:", ipfsMultiHash);

    const actionIsRegistered = await contract.isActionRegistered(ipfsMultiHash);

    console.log("actionIsRegistered:", actionIsRegistered);

    if( ! actionIsRegistered) {
        throwError(`Action ${ipfsMultiHash} is not registered.`);
        return;
    }

    let permittedAction: any;

    try{
        permittedAction = await contract.addPermittedAction(selectedToken, ipfsMultiHash);
    }catch(e: any){
        throwError(e.message);
    }

    return permittedAction;
}

export default callAddPermittedAction;