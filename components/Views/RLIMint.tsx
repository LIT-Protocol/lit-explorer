import throwError from "../../utils/throwError";
import { useAppContext } from "../Contexts/AppContext";
import CardInputs, { MyFieldType, MyProgressI } from "../UI/CardInputs";
import moment from "moment";
import { MultiETHFormat } from "../../utils/converter";
import { useState } from "react";
import { wait } from "../../utils/utils";

const RLIMint = ({
    onMint
}: {
    onMint?(cost: MultiETHFormat, tx: any): void
}) => {

    // (app context)
    const { rliContract } = useAppContext();

    const [ progress, setProgress] = useState<MyProgressI>({progress: 0, message: ''});

    // (event) handle click
    const handleClick = async (res: any) : Promise<void> => {

        // -- validate
        if(res.length < 2) {
            throwError("You must fill in all fields.");
            return;
        }

        console.log("HandleClick:", res);

        const requests = parseInt(res[0].data)
        const timestamp = moment(res[1].data).unix();

        console.log("requests:", requests);
        console.log("timestamp:", timestamp);

        setProgress({
            progress: 50,
            message: 'Calculating cost...',
        })
        let cost;

        try{
            cost = await rliContract.read.costOfRequestsPerSecond(requests, timestamp);
        }catch(e: any){
            setProgress({
                progress: 0,
                message: '',
            })
            throwError(e.message);
            return;
        }
        
        console.log("cost:", cost);

        
        setProgress({
            progress: 75,
            message: 'Minting...',
        })
        // -- mint
        const mintTx = await rliContract.write.mint({
            mintCost: {
                value: cost.arg
            },
            timestamp
        });

        setProgress({
            progress: 100,
            message: 'Done',
        })
        
        await wait(1000);
        
        setProgress({
            progress: 0,
            message: '',
        })

        if( onMint ){
            onMint(cost, mintTx);
        }
        
    }

    return (
        <div className="mt-12 mb-12">
            <CardInputs 
                title="Set RLI Capability"
                fields={[
                    {
                        title: "requests/millisecond",
                        label: "",
                    },
                    {
                        title: MyFieldType.DATE_TIME_PICKER,
                        type: MyFieldType.DATE_TIME_PICKER
                    }
                ]}
                buttonText="MINT RLI NFT"
                onSubmit={handleClick}
                progress={progress}
            />
        </div>
    )
}
export default RLIMint;