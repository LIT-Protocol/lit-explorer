import { appendEvenWidths } from "../../utils/mui/mui";
import { useAppContext } from "../Contexts/AppContext";
import LoadData from "../ViewModels/LoadData";
import RenderAction from "./MuiRenders/RenderAction";

const LitActionsByPKPId = ({ pkpId }: { pkpId: any }) => {

	const { network } = useAppContext();

	return (
		<>
			<LoadData
				debug={false}
				cache={true}
				i18n={{
					titleId: "authorised action - title",
					loadingId: "authorised action - loading",
					errorMessageId: "authorised action - error",
				}}
				fetchPath={`/api/get-permitted-by-pkp/${pkpId}?network=${network}`}
				filter={async (rawData: any) => {
					console.log("[pkpId] input<rawData>", rawData);
					return rawData?.data?.actions;
				}}
				renderCols={(width: number) => {
					return appendEvenWidths(
						[
							{
								headerName: "IPFS ID",
								field: "action",
								renderCell: RenderAction,
							},
						],
						width
					);
				}}
				renderRows={(filteredData: any) => {
					return filteredData?.map((item: any, i: number) => {
						return {
							id: i + 1,
							action: item,
						};
					});
				}}
			/>
		</>
	);
};
export default LitActionsByPKPId;
