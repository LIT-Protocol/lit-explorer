import { APP_CONFIG } from "../../app_config";
import { heyShorty } from "../../utils/converter";
import { appendEvenWidths } from "../../utils/mui/mui";
import LoadData from "../LoadData";
import RenderDate from "./MuiRenders/RenderDate";
import RenderLink from "./MuiRenders/RenderLink";

const PKPsByOwnerAddress = ({ownerAddress} : {
    ownerAddress: string
}) => {
    
    return (
        <LoadData
            cache={false}
            key={ownerAddress.toString()}
            debug={false}
            title={`PKP NFTs (${heyShorty(ownerAddress)})`}
            errorMessage="No PKP owners found."
            loadingMessage={`Loading a list of PKP NFTs...`}
            fetchPath={`/api/get-pkps-by-address/${ownerAddress}`}
            filter={(rawData: any) => {
                console.log("on filtered: ", rawData);
                return rawData.data.result.filter(
                (tx: any) => {
                    return tx.contractAddress === APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS.toLowerCase() && 
                    ownerAddress.toString().toLowerCase() == tx.to.toLowerCase();
                }
                );
            } }
            renderCols={(width: any) => {
                return appendEvenWidths([
                    { headerName: "PKP Token ID", field: "tokenID", renderCell: RenderLink},
                    { headerName:"Acquired Date", field: "date",  renderCell: RenderDate},
                    { headerName:"From", field: "from"},
                ], width);
        
            } }
            renderRows={(filteredData: any) => {
                return filteredData?.map((pkp: any, i: number) => {
                    return {
                        id: i + 1,
                        tokenID: pkp.tokenID,
                        date: pkp.timeStamp,
                        from: pkp.from,
                    };
                });
            } }    
      />
    )
}
export default PKPsByOwnerAddress;