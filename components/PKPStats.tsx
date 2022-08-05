import { useEffect, useState } from "react";
import getWeb3Wallet from "../utils/blockchain/getWeb3Wallet";
import MyCard from "./MyCard";
// @ts-ignore
import converter from 'hex2dec';
import { RateLimitContract } from "../utils/blockchain/contracts/RateLimitContract";
import { Button } from "@mui/material";
import {APP_CONFIG, SupportedNetworks} from "../app_config";

declare global {
    interface Window{
        decTohex?(pkpId: string):void
    }
  }

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

    // -- (mounted)
    useEffect(() => {

        // -- (test) export helper 
        window.decTohex = converter.decToHex;


        // -- start running straight away
        (async() => {

            const { signer } = await getWeb3Wallet();

            const contract = new RateLimitContract();

            await contract.connect({
                network: SupportedNetworks.CELO_MAINNET,
                contractAddress: APP_CONFIG.RATE_LIMIT_CONTRACT_ADDRESS,
                signer,
            })

            setContract(contract);

            const rateLimitWindow = await contract.read.rateLimitWindow();
            console.log("[mounted] rateLimitWindow:", rateLimitWindow);
            
            const defaultRateLimitWindow = await contract.read.getDefaultRateLimitWindow();
            console.log("[mounted] defaultRateLimitWindow:", defaultRateLimitWindow);

            const requestsBySecond = await contract.read.getFreeRequestsPerSecond();
            console.log("[mounted] requestsBySecond:", requestsBySecond);
            
            const costPerMillisecond = await contract.read.getCostPerMillisecond();
            console.log("[mounted] costPerMillisecond:", costPerMillisecond);

            const totalCost = await contract.read.calculateCost(1000, 1659717168);
            console.log("[mounted] totalCost:", totalCost);

            const totalCostByRequestsPerSecond = await contract.read.calculateCostByRequestsPerSecond(1000000000000, 1659717168);
            console.log("[mounted] totalCostByRequestsPerSecond:", totalCostByRequestsPerSecond);


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