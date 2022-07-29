import LoadData from "../../components/LoadData";
import MainLayout from "../../components/MainLayout"
import RenderLink from "../../utils/RenderLink";
import { NextPageWithLayout } from "../_app"

const PKPsPage: NextPageWithLayout = () => {

  return (
    <>
    <LoadData
        debug={false}
        title="PKP Tokens:"
        errorMessage="No PKPs found."
        fetchPath={`/api/get-all-pkps`}
        filter={(rawData: any) => {
          console.log("on filtered: ", rawData);
          return rawData?.data?.tokens;
        } }
        renderCols={(width: number) => {
          return [
            { headerName: "PKP Token ID", field: "address", width, renderCell: RenderLink}
          ];
        } }
        renderRows={(filteredData: any) => {
          // return filteredData;
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

export default PKPsPage

PKPsPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}