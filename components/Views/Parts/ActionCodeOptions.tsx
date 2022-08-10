import { Chip, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppContext } from "../../Contexts/AppContext";
import { MyProgressI } from "../../UI/CardInputs";
import ActionRegister from "./ActionRegister";

const ActionCodeOptions = (props: {
    ipfsId: string | any,
}) => {

    // -- (app context) 
    const  { routerContract } = useAppContext();

    const [isRegistered, setIsRegistered] = useState<boolean | any>(null);

    // -- (mounted)
    useEffect(() => {

        (async () => {
            await checkIsRegistered();
        })();
        
    }, [])

    // -- (void) check is registered 
    const checkIsRegistered = async () => {
        const _isRegistered = await routerContract.read.isActionRegistered(props.ipfsId);
        console.log("[checkIsRegistered] _isRegistered:", _isRegistered);
        setIsRegistered(_isRegistered);
    }

    // -- (event) update UI based on progress
    const onProgress = async (progress: MyProgressI) => {

        const _progress = progress.progress || 0;

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

    // -- finally
    return (
        <Stack direction="row" spacing={1}>
            {
                isRegistered ? 
                renderRegistered() : 
                renderNotReigstered()
            }
        </Stack>
    );
}

export default ActionCodeOptions;