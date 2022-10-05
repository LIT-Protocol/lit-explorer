import { Contract } from "ethers";
import { ContractProps } from "./ContractI";
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { getContract } from './getContract';
import { decimalTohex } from "../../converter";
import { getBytes32FromMultihash, getIPFSIdFromBytes32, IPFSHash, ipfsIdToIpfsIdHash, parseMultihashContractResponse } from "../../ipfs/ipfsHashConverter";
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
        
        const config = {
            network: props?.network ?? APP_CONFIG.NETWORK_NAME,
            signer: props?.signer,
            contractAddress: props?.contractAddress ?? APP_CONFIG.ROUTER_CONTRACT_ADDRESS
        };

        const _contract = await getContract(config);

        if( ! _contract ){
            console.error("Failed to get contract");
        }else{
            this.contract = _contract;
            console.log("[RouterContract] connect input<config>:", config);
    
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
        
        const isRouted = this.contract.isRouted(tokenId);

        return isRouted;
    }

    getFullPubKey = async (tokenId: any) : Promise<any> => {

        const pubKey = await this.contract.getFullPubkey(tokenId);

        return pubKey;
    
    }

    getPermittedAddresses = async (id: any) => {

        console.log("[getPermittedAddresses] input<id>:", id);
        
        let addresses;
        
        try{
            addresses = await this.contract.getPermittedAddresses(id)
        }catch(e: any){
            console.log("[getPermittedAddresses] error<e.message>:", e.message);
            addresses = [];
        }

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

    /**
     * 
     * Check if an action is permitted given the pkpid and ipfsId
     * 
     * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
     * @param { string } ipfsId @param { string } ipfsId  QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
     * 
     * @return { object } transaction 
     */
    isPermittedAction = async (pkpId: string, ipfsId: string) : Promise<boolean> => {
        console.log("[isPermittedAction] input<pkpId>:", pkpId);
        console.log("[isPermittedAction] input<ipfsId>:", ipfsId);

        const ipfsHash = ipfsIdToIpfsIdHash(ipfsId);
        console.log("[addPermittedAction] converted<ipfsHash>:", ipfsHash);

        const bool = await this.contract.isPermittedAction(pkpId, ipfsHash);
        
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
        console.log("[isActionRegistered] input<ipfsid>:", ipfsId);
        
        const ipfsMultiHash = ipfsIdToIpfsIdHash(ipfsId);
        console.log("[isActionRegistered] converted<ipfsMultiHash>:", ipfsMultiHash);
        
        const bool = await this.contract.isActionRegistered(ipfsMultiHash);
        console.log("[isActionRegistered] output<bool>:", bool);

        return bool;
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
        
        const res = await this.contract.ipfsIds(solidityIpfsId)
        console.log("[getIpfsIds] converted<res>:", res);
        
        const bytes32 = parseMultihashContractResponse(res);
        console.log("[getIpfsIds] converted<bytes32>:", bytes32);
        
        const ipfsId = getIPFSIdFromBytes32(bytes32);
        console.log("[getIpfsIds] converted<ipfsId>:", ipfsId);

        return (ipfsId as string);
        
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
     * TODO: add transaction type
     * Add permitted action to a given PKP id & ipfsId
     * 
     * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
     * @param { string } ownerAddress @param { string } ownerAddress  0x3B5dD2605.....22aDC499A1
     * 
     * @return { object } transaction 
     */
     addPermittedAddress = async (pkpId: string, ownerAddress: string) : Promise<any> => {

        console.log("[addPermittedAddress] input<pkpId>:", pkpId);
        console.log("[addPermittedAddress] input<ownerAddress>:", ownerAddress);
        
        
        const tx = await this.contract.addPermittedAddress(pkpId, ownerAddress);
        
        console.log("[addPermittedAddress] output<tx>:", tx);

        return tx;
    }

    /**
     * TODO: add transaction type
     * Add permitted action to a given PKP id & ipfsId
     * 
     * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
     * @param { string } ipfsId @param { string } ipfsId  QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
     * 
     * @return { object } transaction 
     */
    addPermittedAction = async (pkpId: string, ipfsId: string) : Promise<any> => {

        console.log("[addPermittedAction] input<pkpId>:", pkpId);
        console.log("[addPermittedAction] input<ipfsId>:", ipfsId);
        
        const ipfsHash = ipfsIdToIpfsIdHash(ipfsId);
        console.log("[addPermittedAction] converted<ipfsHash>:", ipfsHash);
        
        const tx = await this.contract.addPermittedAction(pkpId, ipfsHash);
        console.log("[addPermittedAction] output<tx>:", tx);

        return tx;
    }

    /**
     * Revoke permitted action of a given PKP id & ipfsId
     * 
     * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
     * @param { string } ipfsId @param { string } ipfsId  QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
     * 
     * @return { object } transaction 
     */
    revokePermittedAction = async (pkpId: string, ipfsId: string) : Promise<any> => {

        console.log("[revokePermittedAction] input<pkpId>:", pkpId);
        console.log("[revokePermittedAction] input<ipfsId>:", ipfsId);
        
        const ipfsHash = ipfsIdToIpfsIdHash(ipfsId);
        console.log("[revokePermittedAction] converted<ipfsHash>:", ipfsHash);
        
        const tx = await this.contract.removePermittedAction(pkpId, ipfsHash);
        console.log("[revokePermittedAction] output<tx>:", tx);

        return tx;
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