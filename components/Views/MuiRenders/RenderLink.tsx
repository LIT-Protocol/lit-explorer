import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { SupportedSearchTypes } from "../../../app_config";
import { AppRouter } from "../../../utils/AppRouter";
import { heyShorty } from "../../../utils/converter";
import Copy from "../../UI/Copy";
import { MyOptions } from "./RenderPKPToAddress";
const { toChecksumAddress } = require('ethereum-checksum-address')

const RenderLink = (props: GridRenderCellParams, options: MyOptions) => {

    const router = useRouter();

    const { value } = props;

    // -- (render)
    const renderValue = (v: string) => {

        if ( AppRouter.getSearchType(v) === SupportedSearchTypes.ETH_ADDRESS){
            v = toChecksumAddress(v)
        }

        return (
            <>
                <div className="flex justify-cell">
                    <div id={`link-${value}`} className="flex-content link" onClick={() => router.push(AppRouter.getPage(value))}>
                        { options?.short ? heyShorty(v) : v }
                    </div>                    
                    { options?.copy ? <Copy value={v} /> : '' }
                </div>
            </>
        )
    }

    return (
        <div className="flex justify-cell">
            { renderValue(value) }
        </div>
    )
}

export default RenderLink;