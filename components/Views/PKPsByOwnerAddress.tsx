import { APP_CONFIG } from "../../app_config";
import { heyShorty } from "../../utils/converter";
import { appendEvenWidths } from "../../utils/mui/mui";
import LoadData from "../ViewModels/LoadData";
import RenderDate from "./MuiRenders/RenderDate";
import RenderLink from "./MuiRenders/RenderLink";
import RenderPKPToAddress from "./MuiRenders/RenderPKPToAddress";
import RenderPKPToBTC from "./MuiRenders/RenderPKPToBTC";
import RenderPKPToPubKey from "./MuiRenders/RenderPKPToPubKey";

interface PKPsByOwnerAddressOptions{
    title?: string,
    loadingMessage?: string,
    height?: number
}

const PKPsByOwnerAddress = ({ownerAddress, options} : {
    ownerAddress: string,
    options?: PKPsByOwnerAddressOptions
}) => {
    
    return (
        <LoadData
            height={options?.height}
            cache={false}
            key={ownerAddress.toString()}
            debug={false}
            title={options?.title ?? `PKPs by a given address: ${heyShorty(ownerAddress, 4)}`}
            errorMessage="No PKP owners found."
            loadingMessage={options?.loadingMessage ?? `Loading a list of PKPs by a given address...`}
            fetchPath={`/api/get-pkps-by-address/${ownerAddress}`}
            filter={(rawData: any) => {
                console.log("[PKPsByOwnerAddress] input<rawData>", rawData);
                return rawData.data.result.filter(
                (tx: any) => {
                    return tx.contractAddress === APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS.toLowerCase() && 
                    ownerAddress.toString().toLowerCase() == tx.to.toLowerCase();
                }
                );
            } }
            renderCols={(width: any) => {
                return appendEvenWidths([
                    { headerName: "PKP Token ID", field: "tokenId", renderCell: (props: any) => {
                        return RenderLink(props, {short: true, copy: true})
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
                    { headerName:"Acquired Date", field: "date",  renderCell: RenderDate},
                    { headerName:"From", field: "from"},
                ], width);
        
            } }
            renderRows={(filteredData: any) => {
                return filteredData?.map((pkp: any, i: number) => {
                    return {
                        id: i + 1,
                        tokenId: pkp.tokenID,
                        address: pkp.tokenID,
                        date: pkp.timeStamp,
                        from: pkp.from === '0x0000000000000000000000000000000000000000' ? 'Minted' : pkp.from,
                    };
                });
            } }    
      />
    )
}
export default PKPsByOwnerAddress;