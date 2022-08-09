import { Button } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { RLIContract } from "../../utils/blockchain/contracts/RLIContract";
import LoadData from "../LoadData";
import RLITransferModal from "../Modals/RLITransferModal";

const RLIsByOwner = ({
    contract,
    ownerAddress,
}: {
    contract: RLIContract,
    ownerAddress: string
}) => {

    const [list, setList] = useState();


    useEffect(() => {

        (async () => {
            let list = await contract.read.getTokensByOwnerAddress(ownerAddress)
            console.log("[mounted] tokens:", list);

            setList(list);
        })();

    }, [])

    // -- (render) owners Rate Limit NFTs form actions
    const renderOwnersRLIsFromActions = (RLI: any) => {
        return <>
            <RLITransferModal
                contract={contract}
                RLI={RLI}
                ownerAddress={ownerAddress}
            />
        </>

    }

    if( ! list ) return <>Loading a list of RLI NFTs that you hold...</>
    
    return (
        <>
            {/* ------ List of RLIs owner owns ----- */}
            <LoadData
                key={"List of RLIs owner owns"}
                debug={false}
                title={`Your Rate Limits NFTs (as a PKP controller)`}
                errorMessage="Failed to get the list of RLIs you hold"
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