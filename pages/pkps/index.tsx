import { GridRenderCellParams } from "@mui/x-data-grid";
import LoadData from "../../components/LoadData";
import MainLayout from "../../components/MainLayout"
import { decimalTohex, pub2Addr } from "../../utils/converter";
import RenderLink from "../../utils/RenderLink";
import { NextPageWithLayout } from "../_app"

const PKPsPage: NextPageWithLayout = () => {

  const renderPubKey = (props: any) => {

    const pkpId = decimalTohex(props.row.tokenId).replaceAll('0x', '');

    const address = pub2Addr(pkpId);

    return address;

  }

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
            { headerName: "PKP Token ID", field: "tokenId", width: width * .5, renderCell: RenderLink},
            { headerName: "Address", field: "address", width: width * .5, renderCell: renderPubKey},
          ];
        } }
        renderRows={(filteredData: any) => {
          // return filteredData;
          return filteredData?.map((item: any, i: number) => {
            return {
              id: i + 1,
              tokenId: item,
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