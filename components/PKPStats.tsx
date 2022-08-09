import { useEffect, useState } from "react";
import getWeb3Wallet from "../utils/blockchain/getWeb3Wallet";
import MyCard from "./MyCard";
import { RLIContract } from "../utils/blockchain/contracts/RLIContract";
import { Button } from "@mui/material";
import {APP_CONFIG, SupportedNetworks} from "../app_config";
import RLIListByOwner from "./Views/RLIListByOwner";
import { useAppContext } from "./AppContext";
import RLICalculator from "./Views/RLICalculator";
import { MultiETHFormat } from "../utils/converter";
import { wait } from "../utils/utils";

// NOTE: Flows
// 1. Get the list of RLI a PKP controller holds
// 2. Get the list of RLIs that a PKP holds
// 3. Calculator: 
//    - "requests per millisecond" as an input
//    - "timepicker" as an input
// 4. Calculator: 
//    - "amount would love to pay" as input
//    - "timepicker" as an input
// TODO: requires a date picker for calculating cost for the future

const PKPStats = ({pkpId} : {
    pkpId: any
}) => {

    // -- (app context)
    const { rliContract } = useAppContext();

    // -- (states)
    const [contract, setContract] = useState<RLIContract>();
    const [ownerAddress, setOwnerAddress] = useState<string>();
    const [enabledRLIListByOwner, setEnabledRLIListByOwner] = useState(false);
    
    // -- (void) mint RLI NFT
    // const mintRLI = async () : Promise<void> => {
        
    //     console.log("[mintRLI]");

    //     // const mint = await contract.
    //     rliContract.write.mint();

    // }

    // -- (event) on calculate
    const onMint = async (cost: MultiETHFormat, tx: any) => {
        setEnabledRLIListByOwner(false);
        console.log("[onMint] cost:", cost)
        console.log("[onMint] tx:", tx)
        await wait(1000);
        setEnabledRLIListByOwner(true);
    }


    // -- (mounted)
    useEffect(() => {

        // -- start running straight away
        (async() => {

            const { signer, ownerAddress } = await getWeb3Wallet();

            console.log("ownerAddress:", ownerAddress);

            const contract = new RLIContract();

            await contract.connect({
                network: SupportedNetworks.CELO_MAINNET,
                contractAddress: APP_CONFIG.RATE_LIMIT_CONTRACT_ADDRESS,
                signer,
            })

            setContract(contract);
            setOwnerAddress(ownerAddress);
            setEnabledRLIListByOwner(true);

            // -- (DONE (RLIListByOwner)) get the list of RLIs a owner owns
            // const listOfRLIs = await contract.read.getTokensByOwnerAddress(ownerAddress)
            // console.log("[mounted] tokens:", listOfRLIs);

            // setListOfRByOwner(listOfRLIs);
            
            // -- (TODO) get the list of RLIs a PKP holds
            // const tokens = await contract.read.getTokensByPKPID(pkpId)
            // console.log("[mounted] tokens:", tokens);
            
            // -- (TODO) (Safe Transfer)
            // const res = await contract.write.transferRLI({
            //     fromAddress: ownerAddress,
            //     toAddress: decimalTohex("104351356416782318547361099599174641266708022357390197911624806385736986986952"),
            //     RLITokenAddress: ''
            // });
            // console.log("[mounted] res:", res);
            
            
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

    // -- validate
    if(!contract || !ownerAddress ) return <>'Loading...'</>;

    return (
        <>  
            <div className="mt-24">
                <MyCard title={"Stats"}>
                    <RLICalculator onMint={onMint}/>

                    {
                        enabledRLIListByOwner ? 
                        <RLIListByOwner contract={contract} ownerAddress={ownerAddress} /> : 
                        ''
                    }
                </MyCard>
            </div>
        </>
    )
}
export default PKPStats;