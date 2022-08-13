import { useEffect, useState } from "react";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import { appendEvenWidths } from "../../utils/mui/mui";
import { wait } from "../../utils/utils";
import { useAppContext } from "../Contexts/AppContext";
import LoadData from "../ViewModels/LoadData";
import PKPOptionsModal from "../Modals/PKPOptionsModal";
import RenderLink from "./MuiRenders/RenderLink";

const PKPPermittedControllersByPKPId = ({ pkpId }: {
    pkpId: any,
}) => {

    // -- (app context)
    const { routerContract } = useAppContext();

    // -- (state)
    const [updating, setUpdating] = useState(false);
    const [isPermitted, setIsPermitted] = useState(false);
    const [cache, setCache] = useState(true)

    
    useEffect(() => {

        (async () => {
            
            const { ownerAddress } = await getWeb3Wallet();

            const _isPermitted = await routerContract.read.isPermittedAddress(pkpId, ownerAddress);

            setIsPermitted(_isPermitted);

        })();

    }, [])

    // -- (render) render status
    const renderStatus = () => {

        if( ! isPermitted ){
            return <></>
        }

        return <PKPOptionsModal 
            pkpId={pkpId}
            onDone={async (userAddress: string) => {
                console.warn("[onDone] userAddress:", userAddress);
                setUpdating(true);
                setCache(false);
                await wait(1000);
                setUpdating(false);
                await wait(1000);
                setCache(true);
            }} 
        />;
    }


    // -- validate
    if ( ! pkpId ) return <>Loading PKP id...</>
    if ( updating ) return <>Updating...</>

    return (
        <LoadData
          key={pkpId?.toString()}
          debug={false}
          cache={cache}
          title="Authorised PKP Controllers:"
          renderStatus={renderStatus()}
          errorMessage="No PKP owners found."
          loadingMessage="Loading authorised PKP controllers..."
          fetchPath={`/api/get-permitted-by-pkp/${pkpId}`}
          filter={(rawData: any) => {
            console.log("[PKPPermittedControllersByPKPId] input<rawData>", rawData);
            return rawData?.data?.addresses;
          } }
          renderCols={(width: number) => {
            return appendEvenWidths([
              { headerName: "Address", field: "address", renderCell: RenderLink}
            ], width);
          } }
          renderRows={(filteredData: any) => {
            return filteredData?.map((item: any, i: number) => {
              return {
                id: i + 1,
                address: item,
              };
            });
          } }    
      />
    )
}
export default PKPPermittedControllersByPKPId;