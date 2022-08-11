import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { AppRouter } from "../../../utils/AppRouter";
import { heyShorty } from "../../../utils/converter";
import Copy from "../../UI/Copy";
import { MyOptions } from "./RenderPKPToAddress";

const RenderRLITokenId = (props: GridRenderCellParams, options: MyOptions) => {

    const router = useRouter();

    const { value } = props;

    // -- (render)
    const renderValue = (v: string) => {

        return (
            <>
                <div className="flex">
                    {/* <a className="flex-content" href={`${AppRouter.getPage(value)}`} onClick={() => router.push(AppRouter.getPage(value))}> */}
                        { options?.short ? heyShorty(v) : v }
                    {/* </a>                     */}
                    { options?.copy ? <Copy value={v} /> : '' }
                </div>
            </>
        )
    }

    return (
        <div className="flex ">
            { renderValue(value) }
        </div>
    )
}

export default RenderRLITokenId;