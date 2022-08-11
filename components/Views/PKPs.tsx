import { appendEvenWidths } from "../../utils/mui/mui";
import Copy from "../UI/Copy";
import LoadData from "../ViewModels/LoadData";
import RenderLink from "./MuiRenders/RenderLink";
import RenderPKPToAddress from "./MuiRenders/RenderPKPToAddress";
import RenderPKPToBTC from "./MuiRenders/RenderPKPToBTC";
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
                    { headerName: "PKP Token ID", field: "tokenId", renderCell: (props: any) => {
                        return RenderLink(props, {short: true, copy: true}); 
                    }},
                    { headerName: "ETH Address", field: "address", renderCell: (props: any) => {
                        return RenderPKPToAddress(props, {short: true, copy: true});
                    }},
                    { headerName: "BTC Address", field: "btc", renderCell: (props: any) => {
                        return RenderPKPToBTC(props, {short: true, copy: true});
                    }},
                    { headerName: "Public Key", field: "copy", renderCell: (props: any) => {
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
                    btc: item,
                    copy: item,
                };
            });
            } }    
        />
    )
}
export default PKPs;