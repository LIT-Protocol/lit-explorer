import { Chip, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import getPubkeyRouterAndPermissionsContract from "../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import { ipfsIdToIpfsIdHash } from "../utils/ipfs/ipfsHashConverter";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useRouter } from "next/router";
import { RouterPush } from "../utils/RouterPush";
import EditIcon from '@mui/icons-material/Edit';

interface ActionCodeStatusProps {
    ipfsId: string | any,
    onEvent?: Function 
}

const ActionCodeStatus = (props: ActionCodeStatusProps) => {

    const [isRegistered, setIsRegistered] = useState(null);

    const router = useRouter();

    useEffect(() => {

        (async () => {

            const contract = await getPubkeyRouterAndPermissionsContract();
            
            const ipfsHash = ipfsIdToIpfsIdHash(props.ipfsId);
            
            // eg. 0xb4200a696794b8742fab705a8c065ea6788a76bc6d270c0bc9ad900b6ed74ebc
            const isRegistered = await contract.isActionRegistered(ipfsHash);

            setIsRegistered(isRegistered);

            if( props.onEvent ){
                props.onEvent();
            }

        })();
        
    }, [])

    // -- (actions)
    const register = () => {
        RouterPush.registerAction(router, props?.ipfsId)    
    }
    
    // -- if param doesnt have ipfsId
    if(! props?.ipfsId) return <></>;
    if( isRegistered == null ) return <><div className="sm"><CircularProgress disableShrink /></div></>


    // -- (render) registerd
    const renderRegistered = () => {
        return <>
            <Chip label={'Registered'} color={'success'} />
            <Chip onClick={ register } icon={<EditIcon />} label="Edit" />
        </>;
    }
    
    // -- not registered
    const renderNotReigstered = () => {
        return <>
            <Chip onClick={ register } icon={<AppRegistrationIcon />} label="Click to register" />
        </>;
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

export default ActionCodeStatus;