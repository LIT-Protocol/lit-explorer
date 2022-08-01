import { getBytes32FromMultihash, IPFSHash, ipfsIdToIpfsIdHash } from "../ipfs/ipfsHashConverter";
import throwError from "../throwError";
import getPubkeyRouterAndPermissionsContract from "./getPubkeyRouterAndPermissionsContract";
import getWeb3Wallet from "./getWeb3Wallet";

/**
 * Register Action (from router permission contract)
 */
const callRegisterAction = async (ipfsId: string) => {

    console.log("[callRegisterAction]:", ipfsId);

    // -- validate
    if( ! ipfsId || ipfsId == ''){
        throwError("IPFS ID not found.");
        return;
    }

    // -- get wallet
    const { signer } = await getWeb3Wallet();

    const contract = await getPubkeyRouterAndPermissionsContract({ wallet: signer });

    let ipfsHash : IPFSHash = getBytes32FromMultihash(ipfsId);
    
    let ipfsMultiHash = ipfsIdToIpfsIdHash(ipfsId);

    console.log("ipfsHash:", ipfsHash);
    console.log("ipfsMultiHash:", ipfsMultiHash);

    let registerResult: any;

    try{
        registerResult = await contract.registerAction(ipfsHash.digest, ipfsHash.hashFunction, ipfsHash.size);
    }catch(e: any){
        throwError(e.message);
    }

    return registerResult;
}

export default callRegisterAction;