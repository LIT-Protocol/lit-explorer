import { useRouter } from "next/router"
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import RenderDate from '../../utils/RenderDate';
import RenderLink from '../../utils/RenderLink';
import LoadData from '../../components/LoadData';

declare global {
  interface Window{
    ethereum?:any
  }
}

const PKPsPageById: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  if ( ! id ) return <p>Param is not ready</p>

  return (
    
    <>
      <LoadData
      key={id.toString()}
      debug={false}
      title="Authorised PKP Controllers:"
      errorMessage="No PKP owners found."
      loadingMessage="Loading authorised PKP controllers..."
      fetchPath={`/api/get-permitted-by-pkp/${id}`}
      filter={(rawData: any) => {
        console.log("on filtered: ", rawData);
        return rawData?.data?.addresses;
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

      <LoadData
        key={id.toString() + 2}
        debug={false}
        title="Authorised Actions:"
        errorMessage="No authorised actions found."
        loadingMessage="Loading authorised actions..."
        fetchPath={`/api/get-permitted-by-pkp/${id}`}
        filter={(rawData: any) => {
          console.log("on filtered: ", rawData);
          return rawData?.data?.actions;
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