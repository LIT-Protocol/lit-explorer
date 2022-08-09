import { useRouter } from "next/router"
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import RenderLink from '../../components/Views/MuiRenders/RenderLink';
import LoadData from '../../components/LoadData';
import { solidityIpfsIdToCID } from "../../utils/ipfs/ipfsHashConverter";
import { asyncForEachReturn } from "../../utils/utils";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import PKPOptionsModal from "../../components/PKPOptionsModal";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import alertMsg from "../../utils/alertMsg";
import PKPStats from "../../components/PKPStats";
import PKPPermittedControllers from "../../components/Views/PKPPermittedControllers";

declare global {
  interface Window{
    ethereum?:any
  }
}

const PKPsPageById: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  if( ! id ) return <> 'Loading PKP id...'</>;

  return (
    
    <>

      <PKPStats pkpId={id}/>

      <PKPPermittedControllers pkpId={id}/>

      <LoadData
        key={ '2' + id?.toString()}
        debug={false}
        title="Authorised Actions stored on IPFS:"
        errorMessage="No authorised actions found."
        loadingMessage="Loading authorised actions..."
        fetchPath={`/api/get-permitted-by-pkp/${id}`}
        filter={async (rawData: any) => {
          console.log("on filtered: ", rawData);

          const { signer } = await getWeb3Wallet();

          return await asyncForEachReturn(rawData?.data?.actions, async(solidityIpfsId: string) => {
            return await solidityIpfsIdToCID(solidityIpfsId, signer);
          })
        } }
        renderCols={(width: number) => {
          return [
            { headerName: "Address", field: "address", width, renderCell: RenderLink}
          ];
    
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
    </>
  )
}

export default PKPsPageById

PKPsPageById.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}