import { GridRenderCellParams } from "@mui/x-data-grid";
import { appendEvenWidths } from "../../utils/mui/mui";
import LoadData from "../ViewModals/LoadData";
import RenderLink from "./MuiRenders/RenderLink";
import RenderPubKey from "./MuiRenders/RenderPubKey";

const PKPs = () => {

    return (
        <LoadData
            debug={false}
            title="PKP Tokens:"
            loadingMessage="Loading PKPs..."
            errorMessage="No PKPs found."
            fetchPath={`/api/get-all-pkps`}
            filter={(rawData: any) => {
                console.log("on filtered: ", rawData);
                return rawData?.data?.tokens;
            } }
            renderCols={(width: number) => {
                return appendEvenWidths([
                    { headerName: "PKP Token ID", field: "tokenId", width: width * .5, renderCell: RenderLink},
                    { headerName: "Address", field: "address", width: width * .5, renderCell: (props: GridRenderCellParams) => {
                        return RenderPubKey(props);
                    }},
                ], width)
            } }
            renderRows={(filteredData: any) => {
            return filteredData?.map((item: any, i: number) => {
                return {
                    id: i + 1,
                    tokenId: item,
                    address: item,
                };
            });
            } }    
        />
    )
}
export default PKPs;