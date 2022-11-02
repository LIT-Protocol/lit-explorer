import { Contract, ethers } from "ethers";
import { ContractProps } from "./ContractI";
import { APP_CONFIG } from '../../../app_config';
import { getContract } from './getContract';
import { getBytes32FromMultihash, getIPFSIdFromBytes32, getMultihashFromBytes, IPFSHash, parseMultihashContractResponse } from "../../ipfs/ipfsHashConverter";

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
        
        const config = {
            network: props?.network ?? APP_CONFIG.NETWORK_NAME,
            signer: props?.signer,
            contractAddress: props?.contractAddress ?? APP_CONFIG.ROUTER_CONTRACT.ADDRESS
        };

        const _contract = await getContract(config);

        if( ! _contract ){
            console.error("Failed to get contract");
        }else{
            this.contract = _contract;
            console.log("[📝 RouterContract] connect input<config>:", config);
    
            this.read = new ReadRouterContract(this.contract);
            this.write = new WriteRouterContract(this.contract);
        }
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

        console.log("[RouterContracts] isRouted tokenId:", tokenId);
        
        const isRouted = this.contract.isRouted(tokenId);

        return isRouted;
    }

    /**
     * 
     * Get the full public key of the owner of the token
     * NOTE:
     * - (NEW) Mumbai is using the getPubkey() function
     * - Celo is using the getFullPubKey() function
     * Will try to use either way to get the public key
     * 
     */
    getFullPubKey = async (tokenId: any) : Promise<any> => {

        let pubKey = await this.contract.getPubkey(tokenId);

        // Backward compatibility for CELO
        if ( ! pubKey ){
            pubKey = await this.contract.getFullPubKey(tokenId);
        }

        return pubKey;
    
    }


    /**
     * 
     * Check if an action is registered
     * 
     * @param { string } ipfsId QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW 
     * @returns 
     */
    isActionRegistered = async (ipfsId: string) : Promise<boolean> => {

        console.warn("[*** DEPRECATED ***] isActionRegistered, this will always return true, there's no need to use this function anymore.");

        return true;
        // console.log("[isActionRegistered] input<ipfsid>:", ipfsId);
        
        // const ipfsMultiHash = ipfsIdToIpfsIdHash(ipfsId);
        // console.log("[isActionRegistered] converted<ipfsMultiHash>:", ipfsMultiHash);
        
        // const bool = await this.contract.isActionRegistered(ipfsMultiHash);
        // console.log("[isActionRegistered] output<bool>:", bool);

        // return bool;
    }


    /**
     *  
     * Convert IPFS response from Solidity to IPFS ID 
     * From: "0xb4200a696794b8742fab705a8c065ea6788a76bc6d270c0bc9ad900b6ed74ebc"
     * To: "QmUnwHVcaymJWiYGQ6uAHvebGtmZ8S1r9E6BVmJMtuK5WY"
     * 
     * @param { string } solidityIpfsId 
     * 
     * @return { Promise<string> }
     */
    getIpfsIds = async (solidityIpfsId: string) : Promise<string> => {

        console.log("[getIpfsIds] input<solidityIpfsId>:", solidityIpfsId);

        const ipfsId = getMultihashFromBytes(solidityIpfsId);
        console.log("[getIpfsIds] output<ipfsId>:", ipfsId);

        return ipfsId;
        
        // -- OLD
        // const res = await this.contract.ipfsIds(solidityIpfsId)
        // console.log("[getIpfsIds] converted<res>:", res);
        
        // const bytes32 = parseMultihashContractResponse(res);
        // console.log("[getIpfsIds] converted<bytes32>:", bytes32);
        
        // const ipfsId = getIPFSIdFromBytes32(bytes32);
        // console.log("[getIpfsIds] converted<ipfsId>:", ipfsId);

        // return (ipfsId as string);
        
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