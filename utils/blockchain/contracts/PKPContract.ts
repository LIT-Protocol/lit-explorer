import { BigNumber, Contract, ethers } from "ethers";
import { ContractProps } from "./ContractI";
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { getContract } from './getContract';
import { decimalTohex, MultiETHFormat, wei2eth } from "../../converter";
import { asyncForEach } from "../../utils";
import { Either } from "monet";

/**
 * (CLASS) Entry point of accessing the smart contract functionalities
 */
export class PKPContract{

    contract: Contract;
    read: ReadPKPContract;
    write: WritePKPContract;

    constructor(){
        this.contract = ({} as Contract)
        this.read = ({} as ReadPKPContract)
        this.write = ({} as WritePKPContract);
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

        this.read = new ReadPKPContract(this.contract);
        this.write = new WritePKPContract(this.contract);
    }

}

/**
 * (READ CLASS) All read functions on smart contract
 */
export class ReadPKPContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }

    mintCost = async () => {
        
        const mintCost = await this.contract.mintCost();

        return wei2eth(mintCost);
        
    }
}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WritePKPContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }

    mint = async (mintCost: {
        value: any
    }) => {

        const tx = await this.contract.mintNext(APP_CONFIG.ECDSA_KEY, mintCost);

        const res = await tx.wait();

        const tokenIdFromEvent = res.events[0].topics[3];

        return { tx, tokenId: tokenIdFromEvent};

    }
}