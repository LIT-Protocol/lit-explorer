import LoadData from "../../components/LoadData";
import MainLayout from "../../components/MainLayout"
import RenderLink from "../../utils/RenderLink";
import { NextPageWithLayout } from "../_app"

const ActionsPage: NextPageWithLayout = () => {

  return (
    <LoadData
        debug={false}
        title="Lit Actions:"
        errorMessage="No actions found."
        fetchPath={`/api/get-all-actions`}
        filter={(rawData: any) => {
          console.log("on filtered: ", rawData);
          return rawData?.data?.rows?.map((row: any) => {
            return {
              ipfsId: row?.ipfs_pin_hash,
              createdAt: row?.metadata?.keyvalues?.created_at
            }
          });
        } }
        renderCols={(width: number) => {
          return [
            { headerName: "IPFS ID", field: "ipfsId", width: width * .3, renderCell: RenderLink},
            { headerName: "Created at", field: "createdAt", width: width * .3},
            { headerName: "Created at", field: "createdAt", width: width * .3},
          ];
        } }
        renderRows={(filteredData: any) => {
          // return filteredData;
          return filteredData?.map((item: any, i: number) => {
            return {
              id: i + 1,
              ipfsId: item.ipfsId,
              createdAt: item.createdAt || 'Not specified',
            };
          });
        } }    
        />
  )
}

export default ActionsPage

ActionsPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}