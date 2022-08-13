import { useEffect, useState } from "react";
import { heyShorty } from "../../utils/converter";
import { wait } from "../../utils/utils";
import LoadData from "../ViewModels/LoadData";
import RLITransferModal from "../Modals/RLITransferModal";
import { useAppContext } from "../Contexts/AppContext";

const RLIsByOwnerAddress = ({
    ownerAddress,
}: {
    ownerAddress: string
}) => {

    // -- (app context)
    const { rliContract } = useAppContext();

    // -- (state)
    const [list, setList] = useState();
    const [updating, setUpdating] = useState(false);
    const [cache, setCache] = useState(true)

    useEffect(() => {

        (async () => {
            setList( await updateTokens());
        })();

    }, [ownerAddress])

    // -- (void) update tokens
    const updateTokens = async () => {
        let list = await rliContract.read.getTokensByOwnerAddress(ownerAddress)
        console.log("[updateTokens] tokens:", list);

        return list;
    }

    // -- (event) when transfer is done
    const onTransferCompleted = async (data: any) => {
        
        console.log("[onTransferCompleted]:", data);

        setUpdating(true);
        setList( await updateTokens());
        setCache(false);
        await wait(1000);
        setUpdating(false);
        await wait(1000);
        setCache(true);

    }

    // -- (render) owners Rate Limit NFTs form actions
    const renderOwnersRLIsFromActions = (RLI: any) => {
        return <>
            <RLITransferModal
                RLI={RLI}
                ownerAddress={ownerAddress}
                onDone={onTransferCompleted}
            />
        </>
    }

    // -- (validations)
    // if( ! list ) return <>Loading a list of RLI NFTs from { ownerAddress }...</>
    // if ( updating ) return <>Updating...</>

    return (
        <LoadData
            key={"RLI NFTs by owner"}
            debug={false}
            cache={cache}
            useData={true}
            loadingMessage={'Loading RLIs by owner'}
            title={`Rate Limit NFTs (${heyShorty(ownerAddress)})`}
            errorMessage="No Rate Limit NFTs found."
            data={list}
            filter={(rawData: Array<any>) => {
                console.log("[RLIsByOwnerAddress] input<rawData>", rawData);
                return rawData;
            } }
            renderCols={(width: any) => {
                return [
                    { headerName: "Token ID", field: "tokenID", minWidth: width * .10},
                    { headerName: "Requests/second", field: "requestsPerSecond", minWidth: width * .20},
                    { headerName: "Expiry date", field: "expires", minWidth: width * .20},
                    { headerName: "Expired", field: "expired", minWidth: width * .10},
                    { headerName: "Actions", field: "actions", minWidth: width * .20, renderCell: (RLI: any) => renderOwnersRLIsFromActions(RLI)},
                ];
        
            } }
            renderRows={(filteredData: any) => {
                return filteredData?.map((RLI: any, i: number) => {
                    return {
                        id: i + 1,
                        tokenID: RLI.tokenId,
                        requestsPerSecond: RLI.capacity.requestsPerMillisecond,
                        expires: RLI.capacity.expiresAt.formatted,
                        expired: RLI.isExpired,
                        RLI,
                    };
                });
            } }                         
        />
    )
}
export default RLIsByOwnerAddress;