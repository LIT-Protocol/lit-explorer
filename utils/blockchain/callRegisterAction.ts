import getIPFSHash, { IPFSHash } from "../ipfs/getIpfsHash";
import throwError from "../throwError";
import getPubkeyRouterAndPermissionsContract from "./getPubkeyRouterAndPermissionsContract";
import getWeb3Wallet from "./getWeb3Wallet";

/**
 * Register Action (from router permission contract)
 */
const callRegisterAction = async (ipfsId: string) => {

    // -- validate
    if( ! ipfsId || ipfsId == ''){
        throwError("IPFS ID not found.");
        return;
    }

    // -- get wallet
    const { signer } = await getWeb3Wallet();

    const contract = await getPubkeyRouterAndPermissionsContract({ wallet: signer });

    let ipfsHash : IPFSHash = getIPFSHash(ipfsId);

    let registerResult: any;

    try{
        registerResult = await contract.registerAction(ipfsHash.digest, ipfsHash.hashFunction, ipfsHash.size);
    }catch(e: any){
        throwError(e.message);
    }

    return registerResult;
}

export default callRegisterAction;