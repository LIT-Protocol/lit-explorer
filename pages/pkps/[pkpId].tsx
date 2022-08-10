import { useRouter } from "next/router"
import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import RenderLink from '../../components/Views/MuiRenders/RenderLink';
import LoadData from '../../components/ViewModels/LoadData';
import { parseMultihashContractResponse, solidityIpfsIdToCID } from "../../utils/ipfs/ipfsHashConverter";
import { asyncForEachReturn } from "../../utils/utils";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import PKPStats from "../../components/Views/PKPStats";
import PKPPermittedControllers from "../../components/Views/PKPPermittedControllers";
import RenderAction from "../../components/Views/MuiRenders/RenderAction";
import MyCard from "../../components/UI/MyCard";
import PubKeyByPKPId from "../../components/Views/Parts/PubKeyByPKPId";
import ETHAddressByPKPId from "../../components/Views/Parts/ETHAddressByPKPId";

declare global {
  interface Window{
    ethereum?:any
  }
}

const PKPsPageById: NextPageWithLayout = () => {

  const router = useRouter();
  const { pkpId } = router.query;

  if( ! pkpId ) return <> Loading PKP id...</>

  return (
    
    <>

      <MyCard>
        <PubKeyByPKPId pkpId={pkpId}/>
        <ETHAddressByPKPId pkpId={pkpId}/>
      </MyCard>

      <PKPStats pkpId={pkpId}/>
      
      <PKPPermittedControllers pkpId={pkpId}/>

      <LoadData
        key={ '2' + pkpId?.toString()}
        debug={false}
        title="Authorised Actions stored on IPFS:"
        errorMessage="No authorised actions found."
        loadingMessage="Loading authorised actions..."
        fetchPath={`/api/get-permitted-by-pkp/${pkpId}`}
        filter={async (rawData: any) => {
          console.log("on filtered: ", rawData);
          return rawData?.data?.actions;
        } }
        renderCols={(width: number) => {
          return [
            { headerName: "action", field: "action", width, renderCell: RenderAction}
          ];
    
        } }
        renderRows={(filteredData: any) => {
          return filteredData?.map((item: any, i: number) => {
            return {
              id: i + 1,
              action: item,
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