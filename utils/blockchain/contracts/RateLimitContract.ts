import { Contract, Signer } from 'ethers';
import { SupportedNetworks } from '../../../app_config';
import { milliC, MultiETHFormat, MultiTimeFormat, wei2eth } from '../converter';
import { getContract } from '../getContract';

interface RateLimitContractProps{
    signer?: Signer
    contractAddress: string
    network?: SupportedNetworks
}

/**
 * (CLASS) Entry point of accessing the smart contract functionalities
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
 * (READ CLASS) All read functions on smart contract
 */
export class ReadRateLimitContract {

    contract: Contract;

    constructor(contract: Contract){
        this.contract = contract;
    }

    // get rate limit windows
    rateLimitWindow = async () : Promise<MultiTimeFormat> => {

        const rateLimitWindow = await this.contract.RLIHolderRateLimitWindowMilliseconds();

        return milliC(parseInt(rateLimitWindow));
    }

    // get rate limit windows
    getRateLimitWindow = async () : Promise<MultiTimeFormat> => {

        const rateLimitWindow = await this.contract.RLIHolderRateLimitWindowMilliseconds();

        return milliC(parseInt(rateLimitWindow));

    }

    // -- get default rate limit window
    getDefaultRateLimitWindow = async () : Promise<MultiTimeFormat> => {
        
        const rateLimitWindow = await this.contract.defaultRateLimitWindowMilliseconds();

        return milliC(parseInt(rateLimitWindow));

    }

    // get default rate limit window
    getFreeRequestsPerSecond = async () : Promise<number> => {
        
        const requestsBySecond = await this.contract.freeRequestsPerRateLimitWindow();

        return parseInt(requestsBySecond);
    }

    // get cost per additional millisecond
    getCostPerMillisecond = async () : Promise<MultiETHFormat> => {
        
        const cost = await this.contract.additionalRequestsPerMillisecondCost();

        return wei2eth(parseInt(cost));
    }

    // -- calculate cost
    calculateCost = async (milliseconds: number, expiresAt: number) : Promise<MultiETHFormat> => {

        const cost = await this.contract.calculateCost(milliseconds, expiresAt);

        return wei2eth(parseInt(cost));
    }

    // -- calculate cost by requests per second
    calculateCostByRequestsPerSecond = async (wei: number, expiresAt: number) : Promise<MultiETHFormat>=> {

        const cost = await this.contract.calculateRequestsPerSecond(wei, expiresAt);

        return wei2eth(parseInt(cost));
    }
}

/**
 * (WRITE CLASS) All write functions on smart contract
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