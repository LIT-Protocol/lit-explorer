import { BigNumber, Contract, ethers } from "ethers";
import { ContractProps } from "./ContractI";
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { getContract } from './getContract';
import { decimalTohex, hexToDecimal, MultiETHFormat, wei2eth } from "../../converter";
import { asyncForEach } from "../../utils";
import { Either } from "monet";

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

    isPermittedAddress = async (pkpId: number, address: string) : Promise<boolean> => {

        const pkpId_hex = decimalTohex(pkpId);

        const bool = await this.contract.isPermittedAddress(pkpId_hex, address);
        
        return bool
    }

    getPermittedAddresses = async (tokenId: any) => {

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

    getPermittedActions = async (id: any) => {

        const actions = await this.contract.getPermittedActions(id);

        return actions;

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