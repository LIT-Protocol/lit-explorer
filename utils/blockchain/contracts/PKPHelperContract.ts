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
export class PKPHelperContract{

    contract: Contract;
    read: ReadPKPHelperContract;
    write: WritePKPHelperContract;

    constructor(){
        this.contract = ({} as Contract)
        this.read = ({} as ReadPKPHelperContract)
        this.write = ({} as WritePKPHelperContract);
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
            contractAddress: props?.contractAddress ?? APP_CONFIG.PKP_HELPER_CONTRACT.ADDRESS
        };

        const _contract = await getContract(config);

        if ( ! _contract ) return;

        this.contract = _contract;

        console.log("[📝 PKPHelperContract] connect input<config>:", config);

        this.read = new ReadPKPHelperContract(this.contract);
        this.write = new WritePKPHelperContract(this.contract);
    }

}

/**
 * (READ CLASS) All read functions on smart contract
 */
export class ReadPKPHelperContract{

    contract: Contract;
    
    constructor(contract: Contract){
        this.contract = contract;
    }

}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WritePKPHelperContract{

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