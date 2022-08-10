import { GridRenderCellParams } from "@mui/x-data-grid";
import { appendEvenWidths } from "../../utils/mui/mui";
// import ActionCodeStatus from "./Parts/ActionCodeOptions";
import LoadData from "../LoadData";
import RenderLink from "./MuiRenders/RenderLink";
import ActionCodeOptions from "./Parts/ActionCodeOptions";
import ActionRegister from "./Parts/ActionRegister";

const Actions = () => {
    return (
        <LoadData
            debug={false}
            height={500}
            title="Latest Lit Actions:"
            errorMessage="No actions found."
            fetchPath={`/api/get-all-actions`}
            filter={async (rawData: any) => {
            console.log("on filtered: ", rawData);
            return rawData?.data?.rows?.map((row: any) => {
                return {
                ipfsId: row?.ipfs_pin_hash,
                createdAt: row?.metadata?.keyvalues?.created_at,
                }
            });
            } }
            renderCols={(width: number) => {
                return appendEvenWidths([
                    { headerName: "IPFS ID", field: "ipfsId", renderCell: RenderLink},
                    { headerName: "Created at", field: "createdAt"},
                    { headerName: "Actions", field: "registered", renderCell: (props: GridRenderCellParams) => {
                        return <ActionCodeOptions key={props?.value} ipfsId={props?.value}/>;
                    }},
                ], width)
            } }
            renderRows={(filteredData: any) => {
            return filteredData?.map((item: any, i: number) => {
                return {
                id: i + 1,
                ipfsId: item.ipfsId,
                createdAt: item.createdAt || 'Not specified',
                registered: item.ipfsId || 'Not specified',
                };
            });
            } }    
        />
    )
}
export default Actions;