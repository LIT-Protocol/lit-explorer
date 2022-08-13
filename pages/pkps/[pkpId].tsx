import { useRouter } from "next/router"
import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import LoadData from '../../components/ViewModels/LoadData';
import PKPPermittedControllersByPKPId from "../../components/Views/PKPPermittedControllersByPKPId";
import RenderAction from "../../components/Views/MuiRenders/RenderAction";
import MyCard from "../../components/UI/MyCard";
import PubKeyByPKPId from "../../components/Views/Parts/PubKeyByPKPId";
import ETHAddressByPKPId from "../../components/Views/Parts/ETHAddressByPKPId";
import { appendEvenWidths } from "../../utils/mui/mui";

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
      
      <PKPPermittedControllersByPKPId pkpId={pkpId}/>

      <LoadData
        debug={false}
        i18n={{
          titleId: 'authorised action - title',
          loadingId: 'authorised action - loading',
          errorMessageId: 'authorised action - error',
        }}
        fetchPath={`/api/get-permitted-by-pkp/${pkpId}`}
        filter={async (rawData: any) => {
          console.log("[pkpId] input<rawData>", rawData);
          return rawData?.data?.actions;
        } }
        renderCols={(width: number) => {
          return appendEvenWidths([
            { headerName: "IPFS ID", field: "action", renderCell: RenderAction}
          ], width);
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