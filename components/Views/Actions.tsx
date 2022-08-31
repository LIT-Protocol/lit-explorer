import { GridRenderCellParams } from "@mui/x-data-grid";
import { appendEvenWidths } from "../../utils/mui/mui";
import LoadData from "../ViewModels/LoadData";
import RenderLink from "./MuiRenders/RenderLink";
import ButtonActionRegisterByIPFSId from "../Forms/ButtonActionRegisterByIPFSId";

const Actions = () => {
    return (
        <LoadData
            debug={false}
            height={500}
            title="Latest Lit Actions:"
            errorMessage="No actions found."
            fetchPath={`/api/get-all-actions`}
            filter={async (rawData: any) => {
            console.log("[Action] input<rawData>", rawData);
            return rawData?.data?.rows?.map((row: any) => {
                return {
                ipfsId: row?.ipfs_pin_hash,
                createdAt: row?.metadata?.keyvalues?.created_at,
                }
            });
            } }
            renderCols={(width: number) => {
                return appendEvenWidths([
                    { headerName: "IPFS ID", field: "ipfsId", renderCell: (props: any) => {
                        return RenderLink(props, {short: true, copy: true})
                    }},
                    { headerName: "Created at", field: "createdAt"},
                    // { headerName: "Actions", field: "registered", renderCell: (props: GridRenderCellParams) => {
                    //     return <ButtonActionRegisterByIPFSId key={props?.value} ipfsId={props?.value}/>;
                    // }},
                ], width)
            } }
            renderRows={(filteredData: any) => {
            return filteredData?.map((item: any, i: number) => {
                return {
                id: i + 1,
                ipfsId: item.ipfsId,
                createdAt: item.createdAt || 'Not specified',
                // registered: item.ipfsId || 'Not specified',
                };
            });
            } }    
        />
    )
}
export default Actions;