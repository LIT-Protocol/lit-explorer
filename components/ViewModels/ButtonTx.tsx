import { Chip } from "@mui/material";
import { ReactElement, useState } from "react";
import { wait } from "../../utils/utils";
import { MyProgressI } from "../Forms/FormInputFields";
import MyButton from "../UI/MyButton";

interface ButtonTxLabels {
    default: string,
    executing: string,
}

const ButtonDynamic = (props : {
    transaction() : any
    onProgress?(progress: MyProgressI) : void,
    onError(e: any) : void,
    labels: ButtonTxLabels,
    icon?: ReactElement,
    defaultButton?: boolean 
}) => {

    // -- (state)
    const [label, setLabel] = useState<string>(props.labels.default);

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
        updateProgress(0, props.labels.default)
    };

    // -- (action) handle execution
    const handleExecute = async () => {
        
        console.log("[handleExecute]");

        updateProgress(50, props.labels.executing);

        let tx : any;

        try{
            tx = await props.transaction();
        }catch(e: any){
            props.onError(e);
            resetProgress();
            return;
        }

        console.log("[handleExecute] tx:", tx);

        updateProgress(75, 'Waiting for confirmation...');

        const res = await tx.wait();

        updateProgress(100, 'Done!');

        console.log("[handleRegister] res:", res);
        
        await wait(5000);

        resetProgress();

    }

    return (

        <>
        {
            ! props.defaultButton ?
            <Chip onClick={ handleExecute } icon={props.icon} label={label} /> : 
            <MyButton onClick={ handleExecute }>{ label }</MyButton>
        }
        
        </>
    )
}
export default ButtonDynamic;