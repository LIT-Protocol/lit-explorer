import { Contract } from "ethers";
import { ContractProps } from "./ContractI";
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { getContract } from './getContract';
import { decimalTohex } from "../../converter";
import { getBytes32FromMultihash, IPFSHash, ipfsIdToIpfsIdHash } from "../../ipfs/ipfsHashConverter";
import { tryUntil } from "../../tryUntil";

/**
 * (CLASS) Entry point of accessing the smart contract functionalities
 */
export class RouterContract{

    contract: Contract;
    read: ReadRouterContract;
    write: WriteRouterContract;

    constructor(){
        this.contract = ({} as Contract)
        this.read = ({} as ReadRouterContract)
        this.write = ({} as WriteRouterContract);
    }

    /**
     * 
     * Connection must perform before executing any smart contract calls
     * 
     * @param { Signer } signer 
     * @return { void }
     */
     connect = async (props?: ContractProps): Promise<void> => {
        
        this.contract = await getContract({
            network: props?.network ?? SupportedNetworks.CELO_MAINNET,
            signer: props?.signer,
            contractAddress: props?.contractAddress ?? APP_CONFIG.ROUTER_CONTRACT_ADDRESS
        });

        this.read = new ReadRouterContract(this.contract);
        this.write = new WriteRouterContract(this.contract);
    }

}

/**
 * (READ CLASS) All read functions on smart contract
 */
export class ReadRouterContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }

    isRouted = async (tokenId: any) : Promise<boolean>=> {

        const isRouted = this.contract.isRouted(tokenId);

        return isRouted;
    }

    getFullPubKey = async (tokenId: any) : Promise<any> => {

        const pubKey = await this.contract.getFullPubkey(tokenId);

        return pubKey;
    
    }

    getPermittedAddresses = async (id: any) => {

        const addresses = await this.contract.getPermittedAddresses(id);

        return addresses;

    }

    getPermittedActions = async (id: any) => {

        const actions = await this.contract.getPermittedActions(id);

        return actions;

    }

    isPermittedAddress = async (pkpId: number, address: string) : Promise<boolean> => {

        const pkpId_hex = decimalTohex(pkpId);

        const bool = await this.contract.isPermittedAddress(pkpId_hex, address);
        
        return bool
    }

    isPermittedAction = async (tokenId: any, ipfsHash: any) : Promise<boolean> => {

        const bool = await this.contract.isPermittedAction(tokenId, ipfsHash);
        
        return bool
    }


    /**
     * 
     * Check if an action is registered
     * 
     * @param { string } ipfsId QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW 
     * @returns 
     */
    isActionRegistered = async (ipfsId: string) : Promise<boolean> => {
        console.log("[isActionRegistered] input (ipfsid):", ipfsId);
        
        const ipfsMultiHash = ipfsIdToIpfsIdHash(ipfsId);
        console.log("[isActionRegistered] converted (ipfsMultiHash):", ipfsMultiHash);
        
        const bool = await this.contract.isActionRegistered(ipfsMultiHash);
        console.log("[isActionRegistered] output (bool):", bool);

        return bool;
    }

}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WriteRouterContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }


    addPermittedAddress = async (pkpId: number, address: string) => {

        const pkpId_hex = decimalTohex(pkpId);

        const tx = await this.contract.addPermittedAddress(pkpId_hex, address);

        const res = await tx.wait();

        return {
            tx,
            events: res.events,
        }
    }

    addPermittedAction = async (ipfsId: any, pkpId: any) => {

        console.log("ipfsId:", ipfsId);
        console.log("pkpId:", pkpId);
        
        const pkpId_hex = decimalTohex(pkpId);
        console.log("pkpId_hex:", pkpId_hex);
        
        const ipfsMultiHash = ipfsIdToIpfsIdHash(ipfsId);
        console.log("ipfsMultiHash:", ipfsMultiHash);

        let permittedAction = await this.contract.addPermittedAction(pkpId, ipfsMultiHash)

        return permittedAction;

    }

    /**
     * 
     * Register action by converting the IPFS ID (QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW)
     * to 3 parts:
     *  1. digiest: 0xa31...eeb
     *  2. hashFunction: 18
     *  3. size: 32
     * 
     * @param { string } ipfsId  QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
     */
    registerAction = async (ipfsId: string) : Promise<any> => {
        console.log("[registerAction] input ipfsId:", ipfsId);
        
        let byte32 : IPFSHash = getBytes32FromMultihash(ipfsId);
        console.log("[registerAction] convert byte32:", byte32);

        const tx = await this.contract.registerAction(
            byte32.digest,
            byte32.hashFunction,
            byte32.size,
        )
                
        return tx;

    }


}