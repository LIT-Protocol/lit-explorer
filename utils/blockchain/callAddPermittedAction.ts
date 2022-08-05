import { ipfsIdToIpfsIdHash } from "../ipfs/ipfsHashConverter";
import throwError from "../throwError";
import { tryUntil, TryUntilProp } from "../tryUntil";
import getPubkeyRouterAndPermissionsContract from "./getPubkeyRouterAndPermissionsContract";
import getWeb3Wallet from "./getWeb3Wallet";


interface CallAddPermittedActionProp{
    ipfsId: string,
    selectedToken: string,
    signer?: any,
}
/**
 * Register Action (from router permission contract)
 */
const callAddPermittedAction = async (props: CallAddPermittedActionProp) => {

    const ipfsId = props.ipfsId;
    const selectedToken = props.selectedToken;

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
    let _signer: any;
    let contract: any;

    if( props.signer ){
        const { signer } = await getWeb3Wallet();
        _signer = signer;
        contract = await getPubkeyRouterAndPermissionsContract({ wallet: _signer });
    }else{
        _signer = props.signer;
        contract = await getPubkeyRouterAndPermissionsContract({ wallet: props.signer });
    }

    let ipfsMultiHash = ipfsIdToIpfsIdHash(ipfsId);

    let permittedAction = await tryUntil({
        onlyIf: async () => await contract.isActionRegistered(ipfsMultiHash),
        thenRun: async () => await contract.addPermittedAction(selectedToken, ipfsMultiHash),
        onError: (props: TryUntilProp) => {
            throwError(`Failed to execute: ${props}`);
        },
    });

    return permittedAction;
}

export default callAddPermittedAction;