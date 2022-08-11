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
     connect = async (props?: ContractProps): Promise<void> => {

        const config = {
            network: props?.network ?? SupportedNetworks.CELO_MAINNET,
            signer: props?.signer,
            contractAddress: props?.contractAddress ?? APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS
        };

        console.log("[PKPContract] connect input<config>:", config);
        
        this.contract = await getContract(config);

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

    /**
     * 
     * Get mint cost for PKP
     * 
     * @returns { Promise<MultiETHFormat> } 
     */
    mintCost = async () : Promise<MultiETHFormat> => {
        
        const mintCost = await this.contract.mintCost();

        return wei2eth(mintCost);
        
    }

    /**
     * 
     * Get all PKPs by a given address
     * 
     * @param { string } ownerAddress 
     * @returns { Array<string> } a list of PKP NFTs
     */
    getTokensByAddress = async (ownerAddress: string) : Promise<Array<string>> => {
        
        // -- validate
        if ( ! ethers.utils.isAddress(ownerAddress) ){
            throw new Error(`Given string is not a valid address "${ownerAddress}"`);
        }

        let tokens = [];
    
        for(let i = 0;; i++){
    
            let token;
    
            try{
    
                token = await this.contract.tokenOfOwnerByIndex(ownerAddress, i);
    
                token = hexToDecimal(token.toHexString()); 
    
                tokens.push(token);
            
            }catch(e){
                console.log(`[getTokensByAddress] Ended search on index: ${i}`)
                break;
            }
        }
    
        return tokens;
    }

    
    getTokens = async () : Promise<Array<string>> => {

        let tokens = [];
    
        for(let i = 0;; i++){
    
            let token;
    
            try{
    
                token = await this.contract.tokenByIndex(i);
    
                token = hexToDecimal(token.toHexString()); 
    
                tokens.push(token);
            
            }catch(e){
                console.log(`[getTokensByAddress] Ended search on index: ${i}`)
                break;
            }
        }
    
        return tokens;

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