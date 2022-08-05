import { Contract, ethers, Signer } from 'ethers';
import { SupportedNetworks } from '../../../app_config';
import { getContract } from '../getContract';

import getRateLimitContract from '../getRateLimitContract';

interface RateLimitWindow{
    milliseconds: number,
    seconds: number,
    minutes: number,
}

interface Cost{
    wei: number
    eth: number | string
}

// -- (helper) milliseconds converter
export const milliC = (milliseconds: number) : RateLimitWindow => {

    console.log("[milliC]:", milliseconds);

    return {
        milliseconds,
        seconds: milliseconds / 1000,
        minutes: milliseconds / 1000 / 60,
    }
}

// -- (helper) wei to eth converter
export const wei2eth = (v: number) : Cost => {

    let cost : Cost = {
        wei: v,
        eth: ethers.utils.formatEther(v),
    }

    return cost;
}

interface RateLimitContractProps{
    signer?: Signer
    contractAddress: string
    network?: SupportedNetworks
}

/**
 * Entry point of accessing the smart contract functionalities
 */
export class RateLimitContract {

    contract: Contract;
    read: ReadRateLimitContract;
    write: WriteRateLimitContract;

    constructor(){
        this.contract = ({} as Contract);
        this.read = ({} as ReadRateLimitContract)
        this.write = ({} as WriteRateLimitContract);
    }

    /**
     * 
     * Connection must perform before executing any smart contract calls
     * 
     * @param { Signer } signer 
     * @return { void }
     */
    connect = async (props: RateLimitContractProps): Promise<void> => {
        
        // this.contract = await getRateLimitContract({wallet: signer});
        this.contract = await getContract({
            network: props?.network ?? SupportedNetworks.CELO_MAINNET,
            signer: props?.signer,
            contractAddress: props.contractAddress
        });

        this.read = new ReadRateLimitContract(this.contract);
        this.write = new WriteRateLimitContract(this.contract);
    }
}


/**
 * (READ) All read functions on smart contract
 */
export class ReadRateLimitContract {

    contract: Contract;

    constructor(contract: Contract){
        this.contract = contract;
    }

    // get rate limit windows
    rateLimitWindow = async () : Promise<RateLimitWindow> => {

        const rateLimitWindow = await this.contract.RLIHolderRateLimitWindowMilliseconds();

        return milliC(parseInt(rateLimitWindow));
    }

    // get rate limit windows
    getRateLimitWindow = async () : Promise<RateLimitWindow> => {

        const rateLimitWindow = await this.contract.RLIHolderRateLimitWindowMilliseconds();

        return milliC(parseInt(rateLimitWindow));

    }

    // -- get default rate limit window
    getDefaultRateLimitWindow = async () : Promise<RateLimitWindow> => {
        
        const rateLimitWindow = await this.contract.defaultRateLimitWindowMilliseconds();

        return milliC(parseInt(rateLimitWindow));

    }

    // get default rate limit window
    getFreeRequestsPerSecond = async () : Promise<number> => {
        
        const requestsBySecond = await this.contract.freeRequestsPerRateLimitWindow();

        return parseInt(requestsBySecond);
    }

    // get cost per additional millisecond
    getCostPerMillisecond = async () : Promise<Cost> => {
        
        const cost = await this.contract.additionalRequestsPerMillisecondCost();

        return wei2eth(parseInt(cost));
    }

    // -- calculate cost
    calculateCost = async (milliseconds: number, expiresAt: number) : Promise<Cost> => {

        const cost = await this.contract.calculateCost(milliseconds, expiresAt);

        return wei2eth(parseInt(cost));
    }

    // -- calculate cost by requests per second
    calculateCostByRequestsPerSecond = async (wei: number, expiresAt: number) : Promise<Cost>=> {

        const cost = await this.contract.calculateRequestsPerSecond(wei, expiresAt);

        return wei2eth(parseInt(cost));
    }
}

/**
 * (READ) All write functions on smart contract
 */
export class WriteRateLimitContract{

    contract: Contract;

    constructor(contract: Contract){
        this.contract = contract;
    }

    // -- (write)
    mint = async () => {

    }

}