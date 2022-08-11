import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppRouter } from "../../../utils/AppRouter";
import { heyShorty, pub2Addr, pub2BTC } from "../../../utils/converter";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";

export interface MyOptions {
    copy?: boolean,
    short?: boolean,
}

export const Address = ({
    pkpId,
    options
} : {
    pkpId: number,
    options: MyOptions
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

            const _address = pub2BTC(_pubKey);
            
            setAddress(_address);

        })();

    }, [])

    // -- (validation)
    if( ! address ) return <>Loading...</>

    // -- (render) render value
    const renderValue = (address: string) => {

        return (
            <>
                {/* <a href={`${AppRouter.getPage(address)}`} onClick={() => router.push(AppRouter.getPage(address))}> */}
                { options?.short ? heyShorty(address) : address }
                {/* </a> */}
                { options?.copy ? <Copy value={address} /> : '' }
            </>
        )

    }

    // -- (finally)
    return (
        <div className="flex ">
            { renderValue(address) }
        </div>
    )
}

const RenderPKPToBTC = (props: GridRenderCellParams, options: MyOptions) => {

    const pkpId = props.row.tokenId;

    return (
        <Address pkpId={pkpId} options={options}/>
    )
}

export default RenderPKPToBTC;