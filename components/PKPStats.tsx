import { useEffect, useState } from "react";
import getWeb3Wallet from "../utils/blockchain/getWeb3Wallet";
import MyCard from "./MyCard";

import { RateLimitContract } from "../utils/blockchain/contracts/RateLimitContract";
import { Button } from "@mui/material";
import {APP_CONFIG, SupportedNetworks} from "../app_config";

// NOTE: Flows
// 1. 
// 1. Check if user has RLINFT
// TODO: requires a date picker for calculating cost for the future

const PKPStats = () => {

    // -- (states)
    const [contract, setContract] = useState<RateLimitContract>();
    
    // -- (void) mint RLI NFT
    const mintRLI = async () : Promise<void> => {
        
        console.log("[mintRLI]");

        // const mint = await contract.

    }

    // -- get the list of RLIs a owner holds
    const getList = async () => {
        
    }

    // -- (mounted)
    useEffect(() => {

        // -- start running straight away
        (async() => {

            const { signer, ownerAddress } = await getWeb3Wallet();

            const contract = new RateLimitContract();

            await contract.connect({
                network: SupportedNetworks.CELO_MAINNET,
                contractAddress: APP_CONFIG.RATE_LIMIT_CONTRACT_ADDRESS,
                signer,
            })

            setContract(contract);

            // -- get the list of RLIs a owner owns
            const tokens = await contract.read.getTokensByOwnerAddress(ownerAddress)
            console.log("[mounted] tokens:", tokens);


            // const getTokenURIByIndex = await contract.read.getTokenURIByIndex(2);
            // console.log("[mounted] getTokenURIByIndex:", getTokenURIByIndex);

            // const rateLimitWindow = await contract.read.getRateLimitWindow();
            // console.log("[mounted] rateLimitWindow:", rateLimitWindow);

            // const additionalCost = await contract.read.costOfAdditionalRequestsPerMillisecond();
            // console.log("[mounted] additionalCost:", additionalCost);

            // const getTotalRLI = await contract.read.getTotalRLI(addresses[0]);
            // console.log("[mounted] getTotalRLI:", getTotalRLI);

            // const capacity = await contract.read.getCapacityByIndex(2);
            // console.log("[mounted] capacity:", capacity);
            
            // const defaultRateLimitWindow = await contract.read.getDefaultRateLimitWindow();
            // console.log("[mounted] defaultRateLimitWindow:", defaultRateLimitWindow);

            // const requestsBySecond = await contract.read.getDefaultFreeRequestsPerSecond();
            // console.log("[mounted] requestsBySecond:", requestsBySecond);
            
            // const costPerMillisecond = await contract.read.costOfPerMillisecond();
            // console.log("[mounted] costPerMillisecond:", costPerMillisecond);

            // const costOfMilliseconds = await contract.read.costOfMilliseconds(1000, 1659800204);
            // console.log("[mounted] costOfMilliseconds:", costOfMilliseconds);

            // const totalCostByRequestsPerSecond = await contract.read.costOfByRequestsPerSecond(1000000000000, 1659717168);
            // console.log("[mounted] totalCostByRequestsPerSecond:", totalCostByRequestsPerSecond);


        })();

    }, []);
    
    return (
        <>  
            <div className="mt-24">
                <MyCard title={"Stats"}>
                    <Button onClick={mintRLI} className="btn-2">Mint RLI NFT</Button>
                </MyCard>
            </div>
        </>
    )
}
export default PKPStats;