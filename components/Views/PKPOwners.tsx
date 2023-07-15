import { appendEvenWidths } from "../../utils/mui/mui";
import LoadData from "../ViewModels/LoadData";
import RenderLink from "./MuiRenders/RenderLink";

const PKPOwners = () => {
	return (
		<LoadData
			height={500}
			debug={false}
			title="All Owners of PKPs:"
			errorMessage="No PKP owners found."
			fetchPath={"/api/get-all-pkp-owners"}
			filter={(rawData: any) => {
				// console.log("rawData.data:", rawData.data)
				return rawData.data;
			}}
			renderCols={(width: any) => {
				return appendEvenWidths(
					[
						{
							headerName: "ETH Address",
							field: "address",
							renderCell: (props: any) => {
								return RenderLink(props, { copy: true });
							},
						},
					],
					width
				);
			}}
			renderRows={(filteredData: any) => {
				// return filteredData;
				return filteredData?.map((item: any, i: number) => {
					return {
						id: i + 1,
						address: item.address,
					};
				});
			}}
		/>
	);
};
export default PKPOwners;
