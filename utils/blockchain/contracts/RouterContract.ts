import { Contract } from "ethers";
import { ContractProps } from "./ContractI";
import { SupportedNetworks } from '../../../app_config';
import { getContract } from './getContract';

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
     connect = async (props: ContractProps): Promise<void> => {
        
        this.contract = await getContract({
            network: props?.network ?? SupportedNetworks.CELO_MAINNET,
            signer: props?.signer,
            contractAddress: props.contractAddress
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

}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WriteRouterContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }


}