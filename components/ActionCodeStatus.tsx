import { Chip, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import getPubkeyRouterAndPermissionsContract from "../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import { getBytes32FromMultihash, ipfsIdToIpfsIdHash } from "../utils/ipfs/ipfsHashConverter";

interface ActionCodeStatusProps {
    ipfsId: string
}

const ActionCodeStatus = (props: ActionCodeStatusProps) => {

    const [paramLoaded, setParamLoaded] = useState(false);
    const [isRegistered, setIsRegistered] = useState();
    // const [ipfsId, setIpfsId] = useState('' || null || {});

    useEffect(() => {

        (async () => {

            const contract = await getPubkeyRouterAndPermissionsContract();
            
            const ipfsHash = ipfsIdToIpfsIdHash(props.ipfsId);
            
            // eg. 0xb4200a696794b8742fab705a8c065ea6788a76bc6d270c0bc9ad900b6ed74ebc
            const isRegistered = await contract.isActionRegistered(ipfsHash);

            setIsRegistered(isRegistered);

            // setIpfsId(ipfsHash);

        })();
        
    }, [])
    // -- if param doesnt have ipfsId
    if(! props?.ipfsId) return <></>;
    if( ! isRegistered ) return <div className="sm"><CircularProgress disableShrink /></div>

    const label = isRegistered ? 'Registered' : 'Action is not registered';
    const color = isRegistered ? 'success' : 'error';

    // -- all good
    return (
        <>
            <Stack direction="row" spacing={1}>
                <Chip label={label} color={color} />
            </Stack>
        </>
    );
}

export default ActionCodeStatus;