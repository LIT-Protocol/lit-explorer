import { Contract } from "ethers";
import { ContractProps } from "./ContractI";
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { getContract } from './getContract';
import { decimalTohex } from "../../converter";

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


}