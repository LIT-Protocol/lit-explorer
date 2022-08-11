import { Button } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { RLIContract } from "../../utils/blockchain/contracts/RLIContract";
import { heyShorty } from "../../utils/converter";
import { wait } from "../../utils/utils";
import LoadData from "../ViewModels/LoadData";
import RLITransferModal from "../Modals/RLITransferModal";

const RLIsByOwner = ({
    contract,
    ownerAddress,
}: {
    contract: RLIContract,
    ownerAddress: string
}) => {

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
        let list = await contract.read.getTokensByOwnerAddress(ownerAddress)
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
    if( ! list ) return <>Loading a list of RLI NFTs from { ownerAddress }...</>
    if ( updating ) return <>Updating...</>

    return (
        <>
            {/* ------ List of RLIs owner owns ----- */}
            <LoadData
                key={"RLI NFTs by owner"}
                debug={false}
                cache={cache}
                title={`Rate Limit NFTs (${heyShorty(ownerAddress)})`}
                errorMessage="No Rate Limit NFTs found."
                data={list}
                filter={(rawData: Array<any>) => {
                    console.log("on filtered: ", rawData);
                    return rawData;
                } }
                renderCols={(width: any) => {
                    return [
                        { headerName: "Token ID", field: "tokenID", minWidth: width * .10},
                        { headerName: "Requests/second", field: "requestsPerSecond", minWidth: width * .20},
                        { headerName: "Expires", field: "expires", minWidth: width * .20},
                        { headerName: "Expired at", field: "expired", minWidth: width * .10},
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
                } }                         />
        {/* ------ ... List of RLIs owner owns ----- */}
        </>
    )
}
export default RLIsByOwner;