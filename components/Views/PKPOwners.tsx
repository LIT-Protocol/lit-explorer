import { appendEvenWidths } from "../../utils/mui/mui";
import LoadData from "../LoadData";
import RenderLink from "./MuiRenders/RenderLink";

const PKPOwners = () => {

    return (
        <LoadData 
            debug={false}
            title="PKP Owners:"
            errorMessage="No PKP owners found."
            fetchPath={"/api/get-all-pkp-owners"}
            filter={(rawData: any) => {
                return rawData.data.result.map((tx: any) => tx.address);
            }}
            renderCols={(width: any) => {
                return appendEvenWidths([
                    { headerName: "Address", field: 'address', renderCell: RenderLink},
                ], width);
            }}
            renderRows={(filteredData: any) => {
                return filteredData?.map((item: any, i: number) => {
                    return {
                    id: i + 1,
                    address: item,
                    }
                });
            }}
      />
    )
}
export default PKPOwners;