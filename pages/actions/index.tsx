import { GridRenderCellParams } from "@mui/x-data-grid";
import ActionCodeStatus from "../../components/ActionCodeStatus";
import LoadData from "../../components/LoadData";
import MainLayout from "../../components/MainLayout"
import RenderLink from "../../components/Views/MuiRenders/RenderLink";
import { NextPageWithLayout } from "../_app"

const ActionsPage: NextPageWithLayout = () => {

  return (
    <LoadData
        debug={false}
        height={500}
        title="Latest Lit Actions:"
        errorMessage="No actions found."
        fetchPath={`/api/get-all-actions`}
        filter={async (rawData: any) => {
          console.log("on filtered: ", rawData);
          return rawData?.data?.rows?.map((row: any) => {
            return {
              ipfsId: row?.ipfs_pin_hash,
              createdAt: row?.metadata?.keyvalues?.created_at,
            }
          });
        } }
        renderCols={(width: number) => {
          return [
            { headerName: "IPFS ID", field: "ipfsId", width: width * .33, renderCell: RenderLink},
            { headerName: "Created at", field: "createdAt", width: width * .33},
            { headerName: "Actions", field: "registered", width: width * .33, renderCell: (props: GridRenderCellParams) => {
              return <ActionCodeStatus key={props?.value} ipfsId={props?.value}/>;
            }},
          ];
        } }
        renderRows={(filteredData: any) => {
          // return filteredData;
          return filteredData?.map((item: any, i: number) => {
            return {
              id: i + 1,
              ipfsId: item.ipfsId,
              createdAt: item.createdAt || 'Not specified',
              registered: item.ipfsId || 'Not specified',
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