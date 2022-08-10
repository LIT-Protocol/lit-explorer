import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppRouter } from "../../../utils/AppRouter";
import { pub2Addr } from "../../../utils/converter";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";

export const PubKey = ({
    pkpId,
    copyOnly,
} : {
    pkpId: number,
    copyOnly?: boolean
}) => {

    // -- (app context)
    const { routerContract } = useAppContext();
    const router = useRouter();

    // -- (states)
    const [address, setAddress] = useState<string>();
    
    // -- (mounted)
    useEffect(() => {

        (async() => {

            if( address ) return;

            const _pubKey = await routerContract.read.getFullPubKey(pkpId);

            const _address = '0x' + pub2Addr(_pubKey);
            
            setAddress(_address);

        })();

    }, [])

    // -- (event) handleClick
    const handleClick = async (e: any) => {
        
        e.preventDefault();
        
        const value = e.target.innerText;

        router.push(AppRouter.getPage(value))
    }

    
    // -- (validation)
    if( ! address ) return <>Loading...</>

    if( copyOnly ) return <Copy value={address}/>

    // -- (finally)
    return (
        <>
            <a href={`${AppRouter.getPage(address)}`} onClick={handleClick}>{ address }</a>
        </>
    )
}

const RenderPubKey = (props: GridRenderCellParams, copyOnly = false) => {

    const pkpId = props.row.tokenId;

    return (
        <PubKey pkpId={pkpId} copyOnly={copyOnly}/>
    )
}

export default RenderPubKey;