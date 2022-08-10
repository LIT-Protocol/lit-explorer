import { GridRenderCellParams } from "@mui/x-data-grid";
import { appendEvenWidths } from "../../utils/mui/mui";
import Copy from "../UI/Copy";
import LoadData from "../ViewModels/LoadData";
import RenderLink from "./MuiRenders/RenderLink";
import RenderPKPToAddress from "./MuiRenders/RenderPKPToAddress";
import RenderPKPToPubKey from "./MuiRenders/RenderPKPToPubKey";

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
                    { headerName: "PKP Token ID", field: "tokenId", renderCell: (props: GridRenderCellParams) => {
                        return RenderLink(props, {short: true, copy: true}); 
                    }},
                    { headerName: "ETH Address", field: "address", renderCell: (props: GridRenderCellParams) => {
                        return RenderPKPToAddress(props, {short: true, copy: true});
                    }},
                    { headerName: "Public Key", field: "copy", renderCell: (props: GridRenderCellParams) => {
                        return RenderPKPToPubKey(props, {short: true, copy: true});
                    }},
                ], width);
            } }
            renderRows={(filteredData: any) => {
            return filteredData?.map((item: any, i: number) => {
                return {
                    id: i + 1,
                    tokenId: item,
                    address: item,
                    copy: item,
                };
            });
            } }    
        />
    )
}
export default PKPs;