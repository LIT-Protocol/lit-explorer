import { useEffect, useState } from "react";
import { appendEvenWidths } from "../../utils/mui/mui";
import { useAppContext } from "../Contexts/AppContext";
import LoadData from "../ViewModels/LoadData";
import RenderRLITokenId from "./MuiRenders/RenderRLITokenId";

const RLIs = () => {

    // -- (app context)
    const { rliContract } = useAppContext();

    // -- (state)
    const [tokens, setTokens] = useState<Array<any>>();

    // -- (mounted)
    useEffect(() => {

        (async() => {

            await fetchTokens();

        })();

    }, [])

    // -- (void) fetch
    const fetchTokens = async () => {
        
        const _tokens = await rliContract.read.getTokens();
        
        setTokens(_tokens);
        
    }

    // -- (validation)
    // if( ! tokens ) return <></>

    return (
        <LoadData 
            i18n={{
                titleId: 'all rlis - title',
                errorMessageId: 'all rlis - error',
            }}
            debug={false}
            data={tokens}
            useData={true}
            filter={(rawData: any) => rawData}
            renderCols={(width: any) => {
                return appendEvenWidths([
                    { headerName: "Token ID", field: "tokenID", renderCell: RenderRLITokenId},
                    { headerName: "Requests/second", field: "requestsPerSecond"},
                    { headerName: "Expires", field: "expires"},
                    { headerName: "Expired at", field: "expired"},
                ], width);
            }}
            renderRows={(filteredData: any) => {
                return filteredData?.map((RLI: any, i: number) => {
                    return {
                        id: i + 1,
                        tokenID: RLI.tokenId,
                        requestsPerSecond: RLI.capacity.requestsPerMillisecond,
                        expires: RLI.capacity.expiresAt.formatted,
                        expired: RLI.isExpired,
                    };
                });
            }}
        />
    )
}
export default RLIs;