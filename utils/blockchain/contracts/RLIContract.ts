import { BigNumber, Contract, ethers } from 'ethers';
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
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
export class RLIContract {

    contract: Contract;
    read: ReadRLIContract;
    write: WriteRLIContract;

    constructor(){
        this.contract = ({} as Contract);
        this.read = ({} as ReadRLIContract)
        this.write = ({} as WriteRLIContract);
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
            contractAddress: props?.contractAddress ?? APP_CONFIG.RATE_LIMIT_CONTRACT_ADDRESS
        };

        this.contract = await getContract(config);

        console.log("[RLIContract] connect input<config>:", config);

        this.read = new ReadRLIContract(this.contract);
        this.write = new WriteRLIContract(this.contract);
    }
}


/**
 * (READ CLASS) All read functions on smart contract
 */
export class ReadRLIContract {

    contract: Contract;
    userTokens: Array<any>;

    constructor(contract: Contract){
        this.contract = contract;
        this.userTokens = [];
    }

    // ========== Global Scope ==========
    totalSupply = async () : Promise<number> => {
        
        const total = await this.contract.totalSupply();

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

    // owner of RLI
    ownerOf = async (tokenId: number) => {
        
        const ownerOf = this.contract.ownerOf(tokenId)

        return ownerOf;
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

        const tokens = await asyncForEachReturn([...new Array(total)], async (_: undefined, i: number) => {
            
            const token = await this.contract.tokenOfOwnerByIndex(ownerAddress, i);

            const tokenIndex = parseInt(token);

            const URI = await this.getTokenURIByIndex(tokenIndex);

            const capacity = await this.getCapacityByIndex(tokenIndex);

            const isExpired = await this.isTokenExpired(tokenIndex);
            
            return { 
                tokenId: parseInt(token), 
                URI,
                capacity,
                isExpired
            };
        })

        return tokens;
    }

    getTokens = async () : Promise<any> => {

        let total = await this.contract.totalSupply();
        total = parseInt(total);

        const tokens = await asyncForEachReturn([...new Array(total)], async (_: any, i: number) => {
            
            const token = await this.contract.tokenByIndex(i);

            const tokenIndex = parseInt(token);

            const URI = await this.getTokenURIByIndex(tokenIndex);

            const capacity = await this.getCapacityByIndex(tokenIndex);

            const isExpired = await this.isTokenExpired(tokenIndex);
            
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
    costPerMillisecond = async () : Promise<MultiETHFormat> => {
        
        const cost = await this.contract.additionalRequestsPerMillisecondCost();

        return wei2eth(parseInt(cost));
    }

    // -- calculate cost
    costOfRequestsPerSecond = async (requestsPerMillisecond: number, expiresAt: number) : Promise<MultiETHFormat> => {

        const cost = await this.contract.calculateCost(requestsPerMillisecond, expiresAt);

        return wei2eth(cost)
    }

    // -- calculate cost by requests per second
    costOfMilliseconds = async (requests: number, expiresAt: number) : Promise<MultiETHFormat>=> {

        const cost = await this.contract.calculateRequestsPerSecond(requests, expiresAt);

        return wei2eth(parseInt(cost));
    }
}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WriteRLIContract{

    contract: Contract;

    constructor(contract: Contract){
        this.contract = contract;
    }

    // -- (write)
    mint = async ({mintCost, timestamp}: {
        mintCost: {
            value: any
        },
        timestamp: number
    }) => {
        
        const tx = await this.contract.mint(timestamp, mintCost);

        const res = await tx.wait();

        const tokenIdFromEvent = res.events[0].topics[3];

        return { tx, tokenId: tokenIdFromEvent};

    }

    /**
     * Transfer RLI token from one address to another
     * 
     * @property { string } fromAddress
     * @property { string } toAddress
     * @property  { stsring } RLITokenAddress
     * 
     * @return { <Promise<void> } void
     */
    transfer = async ({
        fromAddress,
        toAddress,
        RLITokenAddress,
    }: {
        fromAddress: string,
        toAddress: string,
        RLITokenAddress: string,
    }) : Promise<any> => {
        
        const tx = await this.contract.safeTransfer(
            fromAddress,
            toAddress,
            RLITokenAddress
        );

        console.log("tx:", tx);

        // const res = await tx.wait();

        // return {
        //     tx,
        //     events: res.events
        // }

        return tx;
    }

}