import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppRouter } from "../../../utils/AppRouter";
import { heyShorty } from "../../../utils/converter";
import { solidityIpfsIdToCID } from "../../../utils/ipfs/ipfsHashConverter";
import Copy from "../../UI/Copy";
import { MyOptions } from "./RenderPKPToAddress";

const RenderAction = (props: GridRenderCellParams, options: MyOptions) => {

    const router = useRouter();

    const [ipfsId, setIpfsId] = useState<any>();

    const { value } = props;

    useEffect(() => {
        (async() => {
            const _ipfsId = await solidityIpfsIdToCID(props.formattedValue);
            console.log("[_ipfsId]:", props.formattedValue);
            setIpfsId(_ipfsId);
        })();
    })

    // -- (render)
    const renderValue = () => {

        return (
            <>
                <div className="flex">
                    <a className="flex-content" href={`${AppRouter.getPage(ipfsId)}`} onClick={() => router.push(AppRouter.getPage(ipfsId))}>
                        { options?.short ? heyShorty(ipfsId) : ipfsId }
                    </a>                    
                    { options?.copy ? <Copy value={ipfsId} /> : '' }
                </div>
            </>
        )
    }

    if( ! ipfsId ) return <>Loading...</>;

    return (
        <div className="flex ">
            { renderValue() }
        </div>
    )
}

export default RenderAction;