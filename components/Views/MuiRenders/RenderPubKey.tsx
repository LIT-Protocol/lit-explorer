import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppRouter } from "../../../utils/AppRouter";
import { pub2Addr } from "../../../utils/converter";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";

export const PubKey = ({
    pkpId,
} : {
    pkpId: number
}) => {

    // -- (app context)
    const { routerContract } = useAppContext();
    const router = useRouter();

    // -- (states)
    const [address, setAddress] = useState<string>();
    const [loading, setLoading] = useState(false);
    
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
    if( loading ) return <>Loading...</>
    if( ! address ) return <>Loading...</>

    // -- (finally)
    return (
        <>
            <a href={`${AppRouter.getPage(address)}`} onClick={handleClick}>{ address }</a>
        </>
    )
}

const RenderPubKey = (props: GridRenderCellParams) => {

    const pkpId = props.row.tokenId;

    return (
        <PubKey pkpId={pkpId}/>
    )
}

export default RenderPubKey;