import { useEffect, useState } from "react";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import MyCard from "../UI/MyCard";
import { RLIContract } from "../../utils/blockchain/contracts/RLIContract";
import {APP_CONFIG, SupportedNetworks} from "../../app_config";
import RLIListByOwner from "./RLIsByOwner";
import { useAppContext } from "../Contexts/AppContext";
import RLIMint from "./RLIMint";
import { MultiETHFormat } from "../../utils/converter";
import { wait } from "../../utils/utils";

// NOTE: TODO Flows
// [x] Get the list of RLI a PKP controller holds
// 2. Get the list of RLIs that a PKP holds
// 3. [x] Calculator: 
//    - "requests per millisecond" as an input
//    - "timepicker" as an input
// 4. Calculator: 
//    - "amount would love to pay" as input
//    - "timepicker" as an input
// 5. Transfer 
// [x]requires a date picker for calculating cost for the future

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
    // const RLIMint = async () : Promise<void> => {
        
    //     console.log("[RLIMint]");

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
            
        })();

    }, []);

    // -- validate
    if(!contract || !ownerAddress ) return <>Loading...</>;

    return (
        <>  
            <div className="mt-24">
                <MyCard title={"Stats"}>
                    <RLIMint onMint={onMint}/>

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