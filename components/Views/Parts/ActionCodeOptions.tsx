import { Chip, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditIcon from '@mui/icons-material/Edit';
import { useAppContext } from "../../AppContext";
import { MyProgressI } from "../../UI/CardInputs";
import ActionRegister from "./ActionRegister";

const ActionCodeOptions = (props: {
    ipfsId: string | any,
    onProgress?(progress: MyProgressI) : void,
    refresh?: number
}) => {


    // -- (app context) 
    const  { routerContract } = useAppContext();

    const [isRegistered, setIsRegistered] = useState<boolean | any>(null);

    const router = useRouter();

    // -- (mounted)
    useEffect(() => {

        (async () => {
            await checkIsRegistered();
        })();
        
    }, [props.refresh])

    // -- (void) check is registered 
    const checkIsRegistered = async () => {
        const _isRegistered = await routerContract.read.isActionRegistered(props.ipfsId);
        console.log("[checkIsRegistered] _isRegistered:", _isRegistered);
        setIsRegistered(_isRegistered);
    }

    // -- (event) update UI based on progress
    const onProgress = async (progress: MyProgressI) => {

        const _progress = progress.progress || 0;

        // -- callback
        if(props.onProgress){
            props.onProgress(progress);
        }

        if(_progress >= 0){
            await checkIsRegistered();
        }

    }

    
    // -- (validations) if param doesnt have ipfsId
    if(! props?.ipfsId) return <></>;
    if( isRegistered == null ) return <><div className="sm"><CircularProgress disableShrink /></div></>


    // -- (render) registerd
    const renderRegistered = () => {
        return <>
            <Chip label={'Registered'} color={'success'} />
            {/* <Chip onClick={ () => {} } icon={<EditIcon />} label="Edit" /> */}
        </>;
    }
    
    // -- (render) not registered
    const renderNotReigstered = () => {
        return <ActionRegister 
            onProgress={onProgress} 
            ipfsId={props.ipfsId}
        />
    }

    // -- all good
    return (
        <>
            <Stack direction="row" spacing={1}>
                {
                    isRegistered ? 
                    renderRegistered() : 
                    renderNotReigstered()
                }
            </Stack>
        </>
    );
}

export default ActionCodeOptions;