import { Contract, ethers } from 'ethers';
import { SupportedNetworks } from '../../../app_config';
import { asyncForEachReturn } from '../../utils';
import { milliC, MultiDateFormat, MultiETHFormat, MultiTimeFormat, timestamp2Date, wei2eth } from '../../converter';
import { getContract } from './getContract';
import { Either } from 'monet';
import { ContractProps } from './ContractI';

interface RLICapacity{
    requestsPerMillisecond: number,
    expiresAt: MultiDateFormat
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
    connect = async (props: ContractProps): Promise<void> => {
        
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
    userTokens: Array<any>;

    constructor(contract: Contract){
        this.contract = contract;
        this.userTokens = [];
    }

    // ========== Global Scope ==========
    totalSupply = async () : Promise<number> => {
        
        const total = await this.contract.totalIdCounter();

        return parseInt(total);

    }
    
    // get rate limit windows
    // NOTE: (chris): basically i was just thinking we might want to have separate windows for free (default) vs paid (RLIHolder).
    // like maybe for free you get 10 requests per 60 mins.  but if you pay it's over a 5 min window
    // getRateLimitWindow = async () : Promise<MultiTimeFormat> => {

    //     const rateLimitWindow = await this.contract.RLIHolderRateLimitWindowMilliseconds();

    //     return milliC(parseInt(rateLimitWindow));

    // }

    // ========== User Scope ==========

    // get the number of RLI NFTs that a owner holds
    getTotalRLIByOwnerAddress = async (ownerAddress: string) : Promise<number> => {

        // -- validate
        if ( ! ethers.utils.isAddress(ownerAddress) ){
            throw new Error(`Given string is not a valid address "${ownerAddress}"`);
        }

        const total = await this.contract.balanceOf(ownerAddress)

        return parseInt(total);
    }

    // get token URI
    getTokenURIByIndex = async (index: number) : Promise<string> => {

        const base64 = await this.contract.tokenURI(index);

        const data = base64.split('data:application/json;base64,')[1];

        const dataToString = Buffer.from(data, 'base64').toString('binary');

        return JSON.parse(dataToString);

    }

    // check if token is expired
    isTokenExpired = async (index: number) : Promise<boolean> =>{
        
        const isExpired = await this.contract.isExpired(index);

        return isExpired;

    }

    test = () : Either<Error, Promise<any>> => {

        const capacity = this.getTotalRLIByOwnerAddress('1111');

        return !capacity ? Either.left(new Error("Oops")) : Either.right(capacity);
    }

    // == get owner's tokens
    getTokensByOwnerAddress = async (ownerAddress: string) : Promise<any> => {

        // -- validate
        if ( ! ethers.utils.isAddress(ownerAddress) ){
            throw Error(`Given string is not a valid address "${ownerAddress}"`);
        }

        const total = await this.getTotalRLIByOwnerAddress(ownerAddress);

        const tokens = asyncForEachReturn([...new Array(total)], async (_: undefined, i: number) => {
            
            const token = await this.contract.tokenOfOwnerByIndex(ownerAddress, i);

            const URI = await this.getTokenURIByIndex(i);

            const capacity = await this.getCapacityByIndex(i);

            const isExpired = await this.isTokenExpired(i);
            
            return { 
                tokenId: parseInt(token), 
                URI,
                capacity,
                isExpired
            };
        })

        return tokens;
    }

    getTokensByPKPID = async(pkpId: number) : Promise<any> => {



        return pkpId;

    }

    /**
     * Get the capacity with by token index
     * @param index 
     */
    getCapacityByIndex = async (index: number) : Promise<RLICapacity> => {
        
        const capacity = await this.contract.capacity(index);

        return {
            requestsPerMillisecond: parseInt(capacity[0]),
            expiresAt: {
                timestamp: parseInt(capacity[1]),
                formatted: timestamp2Date(capacity[1]),
            },
        };

    }

    // ========== Default Cases ==========
    // -- get default rate limit window
    getDefaultRateLimitWindow = async () : Promise<MultiTimeFormat> => {
        
        const rateLimitWindow = await this.contract.defaultRateLimitWindowMilliseconds();

        return milliC(parseInt(rateLimitWindow));

    }
    
    // get default rate limit window
    getDefaultFreeRequestsPerSecond = async () : Promise<number> => {
        
        const requestsBySecond = await this.contract.freeRequestsPerRateLimitWindow();

        return parseInt(requestsBySecond);
    }

    // ========== Different ways to get costs ==========

    //  get the cost of additional requests per millisecond
    costOfPerMillisecond = async () : Promise<MultiETHFormat> => {
        
        const cost = await this.contract.additionalRequestsPerMillisecondCost();

        return wei2eth(parseInt(cost));
    }

    // -- calculate cost
    costOfMilliseconds = async (milliseconds: number, expiresAt: number) : Promise<MultiETHFormat> => {

        const cost = await this.contract.calculateCost(milliseconds, expiresAt);

        return wei2eth(parseInt(cost));
    }

    // -- calculate cost by requests per second
    costOfRequestsPerSecond = async (wei: number, expiresAt: number) : Promise<MultiETHFormat>=> {

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

    // -- transfer
    transfer = async ({
        fromAddress,
        toAddress,
        RLITokenAddress,
    }: {
        fromAddress: string,
        toAddress: string,
        RLITokenAddress: string,
    }) : Promise<void> => {
        
        const tx = await this.contract.safeTransfer(
            fromAddress,
            toAddress,
            RLITokenAddress
        );

        console.log("tx:", tx);
    }

}