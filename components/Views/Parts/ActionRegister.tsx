import { Chip } from "@mui/material";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { MyProgressI } from "../../UI/CardInputs";
import { wait } from "../../../utils/utils";
import { useAppContext } from "../../AppContext";
import throwError from "../../../utils/throwError";
import { useState } from "react";

const ActionRegister = (props: {
    ipfsId: string | any,
    onProgress?(progress: MyProgressI) : void
}) => {

    // -- (app context)
    const { routerContract } = useAppContext();
    
    // -- (state)
    const defaultLabel = 'Click to register';

    const [label, setLabel ] = useState<string>(defaultLabel);

    // -- (callback) trigger callback
    const updateProgress = (progress: number, message: string) => {

        setLabel(message);

        if(props.onProgress){
            props.onProgress({
                progress,
                message,
            });
        }
    }

    // -- (void) reset progress
    const resetProgress = () => {
        updateProgress(0, defaultLabel)
    };

    // -- (actions) handle register
    const handleRegister = async () => {

        console.log("[handleRegister]");

        updateProgress(50, 'Registering action...');

        let tx;

        try{
            tx = await routerContract.write.registerAction(props.ipfsId);
        }catch(e: any){
            throwError(e.message);
            resetProgress();
            return;
        }

        console.log("[handleRegister] tx:", tx);
        
        updateProgress(75, 'Waiting for confirmation...');

        const res = await tx.wait();

        updateProgress(100, 'Done!');
        
        console.log("[handleRegister] res:", res);
        
        await wait(5000);

        resetProgress();

    }

    // -- validate
    if( ! props.ipfsId ) return <>Cannot find ipfsid</>;

    return (
        <Chip onClick={ handleRegister } icon={<AppRegistrationIcon />} label={label} />
    )
}
export default ActionRegister;