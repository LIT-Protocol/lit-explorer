import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppRouter } from "../../../utils/AppRouter";
import { heyShorty } from "../../../utils/converter";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";
import { MyOptions } from "./RenderPKPToAddress";

const RenderAction = (props: GridRenderCellParams, options: MyOptions) => {

    // -- (app context)
    const { routerContract } = useAppContext();

    const router = useRouter();

    const [ipfsId, setIpfsId] = useState<any>();

    const { value } = props;

    useEffect(() => {
        (async() => {

            const _solidityIpfsId = props.formattedValue;

            console.log("props.formattedValue:", props.formattedValue);

            const _ipfsId = await routerContract.read.getIpfsIds(_solidityIpfsId);

            console.log("[_ipfsId]:", _ipfsId);

            setIpfsId(_ipfsId);
        })();
    })

    // -- (render)
    const renderValue = () => {

        return (
            <div className="flex">
                <a className="flex-content" href={`${AppRouter.getPage(ipfsId)}`} onClick={() => router.push(AppRouter.getPage(ipfsId))}>
                    { options?.short ? heyShorty(ipfsId) : ipfsId }
                </a>                    
                { options?.copy ? <Copy value={ipfsId} /> : '' }
            </div>
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