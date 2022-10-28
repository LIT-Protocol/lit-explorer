import { BigNumber, Contract, ethers } from "ethers";
import { ContractProps } from "./ContractI";
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { getContract } from './getContract';
import { decimalTohex, hexToDecimal, MultiETHFormat, wei2eth } from "../../converter";
import { asyncForEach } from "../../utils";
import { Either } from "monet";
import { ipfsIdToIpfsIdHash } from "../../ipfs/ipfsHashConverter";

/**
 * (CLASS) Entry point of accessing the smart contract functionalities
 */
export class PKPPermissionsContract{

    contract: Contract;
    read: ReadPKPPermissionsContract;
    write: WritePKPPermissionsContract;

    constructor(){
        this.contract = ({} as Contract)
        this.read = ({} as ReadPKPPermissionsContract)
        this.write = ({} as WritePKPPermissionsContract);
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
            contractAddress: props?.contractAddress ?? APP_CONFIG.PKP_PERMISSIONS_CONTRACT.ADDRESS
        };

        const _contract = await getContract(config);

        if ( ! _contract ) return;

        this.contract = _contract;

        console.log("[📝 PKPPermissionsContract] connect input<config>:", config);

        this.read = new ReadPKPPermissionsContract(this.contract);
        this.write = new WritePKPPermissionsContract(this.contract);
    }

}

/**
 * (READ CLASS) All read functions on smart contract
 */
export class ReadPKPPermissionsContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }

    /** 
     * 
     * Check if an address is permitted 
     * 
     * @param { number } pkpId
     * @param { string } address
     * 
     * @returns { Promise<boolean> }
    */
    isPermittedAddress = async (pkpId: number, address: string) : Promise<boolean> => {

        const pkpId_hex = decimalTohex(pkpId);

        const bool = await this.contract.isPermittedAddress(pkpId_hex, address);
        
        return bool
    }

    /** 
     * 
     * Get all permitted addresses
     * 
     * @param { any } tokenId
     * 
     * @returns { Promise<Array<string>> }
    */
    getPermittedAddresses = async (tokenId: any) : Promise<Array<string>> => {

        console.log("[getPermittedAddresses] input<tokenId>:", tokenId);
        
        let addresses;
        
        try{
            addresses = await this.contract.getPermittedAddresses(tokenId)
        }catch(e: any){
            console.log("[getPermittedAddresses] error<e.message>:", e.message);
            addresses = [];
        }

        return addresses;

    }

    /**
     * 
     * Get permitted action
     * 
     * @param { any } id
     * 
     * @returns { Promise<Array<any>> }
     * 
     */
    getPermittedActions = async (id: any) : Promise<Array<any>>=> {

        const actions = await this.contract.getPermittedActions(id);

        return actions;

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

}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WritePKPPermissionsContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }

    mint = async (mintCost: {
        value: any
    }) => {

        const tx = await this.contract.mintNext(APP_CONFIG.ECDSA_KEY, mintCost);

        const res = await tx.wait();

        window.mint = res;

        console.warn("[DEBUG] window.mint:", window.mint);

        let tokenIdFromEvent;

        // celo
        // tokenIdFromEvent = res.events[0].topics[3]

        // mumbai
        tokenIdFromEvent = res.events[1].topics[3]
        console.warn("tokenIdFromEvent:", tokenIdFromEvent)

        return { tx, tokenId: tokenIdFromEvent};

    }
}