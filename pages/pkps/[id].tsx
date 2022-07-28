import { useRouter } from "next/router"
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import RenderDate from '../../utils/RenderDate';
import RenderLink from '../../utils/RenderLink';
import LoadData from '../../components/LoadData';

const PKPsPageById: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  if ( ! id ) return <p>Param is not ready</p>

  return (<>
    Token ID: { id }<br/>
  </>);

  return (
    
    <LoadData
      key={id.toString()}
      debug={true}
      title="Owners's PKPs:"
      errorMessage="No PKP owners found."
      fetchPath={`/api/get-accs-by-pkp/${id}`}
      filter={(rawData: any) => {
        console.log("on filtered: ", rawData);
        return rawData;
      } }
      renderCols={(width: any) => {
        return [
          { headerName: "123", field: "foo"}
          // { headerName: "PKP Token ID", field: "tokenID", minWidth: width * .5, renderCell: RenderLink},
          // { headerName:"Acquired Date", field: "date", minWidth: width * .2, renderCell: RenderDate},
          // { headerName:"From", field: "from", minWidth: width * .3},
        ];
  
      } }
      renderRows={(filteredData: any) => {
        return filteredData;
        return filteredData?.map((pkp: any, i: number) => {
          return {
            id: i + 1,
            // tokenID: pkp.tokenID,
            // date: pkp.timeStamp,
            // from: pkp.from,
          };
        });
      } }    
      />
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