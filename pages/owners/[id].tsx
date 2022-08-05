import { useRouter } from "next/router"
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import RenderDate from '../../utils/RenderDate';
import RenderLink from '../../utils/RenderLink';
import LoadData from '../../components/LoadData';
import { APP_CONFIG } from "../../app_config";

const OwnersPageById: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  if ( ! id ) return <p>Param is not ready</p>

  return (
    
    <LoadData
      key={id.toString()}
      debug={false}
      title="Owners's PKPs:"
      errorMessage="No PKP owners found."
      fetchPath={`/api/get-pkps-by-address/${id}`}
      filter={(rawData: any) => {
        console.log("on filtered: ", rawData);
        return rawData.data.result.filter(
          (tx: any) => {
            return tx.contractAddress === APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS && 
            id.toString().toLowerCase() == tx.to.toLowerCase();
          }
        );
      } }
      renderCols={(width: any) => {
        return [
          { headerName: "PKP Token ID", field: "tokenID", minWidth: width * .5, renderCell: RenderLink},
          { headerName:"Acquired Date", field: "date", minWidth: width * .2, renderCell: RenderDate},
          { headerName:"From", field: "from", minWidth: width * .3},
        ];
  
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

export default OwnersPageById

OwnersPageById.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}