import { useEffect, useState } from "react";
import { heyShorty } from "../../utils/converter";
import { wait } from "../../utils/utils";
import LoadData from "../ViewModels/LoadData";
import RLITransferModal from "../Modals/RLITransferModal";
import { appendEvenWidths } from "../../utils/mui/mui";
import RenderTxnHash from "./MuiRenders/RenderTxnHash";
import RenderRLIRate from "./MuiRenders/RenderRLIRate";
import RenderRLIExpiry from "./MuiRenders/RenderRLIExpiry";

interface RLIsByOwnerAddressOptions {
	title?: string;
	loadingMessage?: string;
	errorMessage?: any;
	height?: number;
}

const RLIsByOwnerAddress = ({
	ownerAddress,
	options,
}: {
	ownerAddress: string;
	options?: RLIsByOwnerAddressOptions;
}) => {
	// -- (state)
	// const [list, setList] = useState();
	// const [updating, setUpdating] = useState(false);
	// const [cache, setCache] = useState(true);

	// useEffect(() => {
	// 	(async () => {
	// 		setList(await updateTokens());
	// 	})();
	// }, [ownerAddress]);

	// -- (event) when transfer is done
	// const onTransferCompleted = async (data: any) => {
	// 	console.log("[onTransferCompleted]:", data);

	// setUpdating(true);
	// setList(await updateTokens());
	// setCache(false);
	// await wait(1000);
	// setUpdating(false);
	// await wait(1000);
	// setCache(true);
	// };

	// -- (render) owners Rate Limit NFTs form actions
	// const renderOwnersRLIsFromActions = (RLI: any) => {
	// 	return (
	// 		<>
	// 			<RLITransferModal
	// 				RLI={RLI}
	// 				ownerAddress={ownerAddress}
	// 				onDone={onTransferCompleted}
	// 			/>
	// 		</>
	// 	);
	// };

	return (
		<LoadData
			height={options?.height}
			cache={false}
			key={ownerAddress.toString()}
			debug={false}
			title={
				options?.title ??
				`Capacity Credits NFTs by a given address: ${heyShorty(
					ownerAddress,
					4
				)}`
			}
			errorMessage={
				options?.errorMessage ?? "No Capacity Credits NFTs found."
			}
			loadingMessage={
				options?.loadingMessage ??
				`Loading a list of Capacity Credits NFTs by a given address...`
			}
			fetchPath={`/api/get-rlis-by-address/${ownerAddress}`}
			filter={(rawData: any) => {
				console.log("[RLIsByOwnerAddress] input<rawData>", rawData);
				return rawData.data;
			}}
			renderCols={(width: any) => {
				return appendEvenWidths(
					[
						{
							headerName: "Token ID",
							field: "tokenID",
						},
						{
							headerName: "Requests per second",
							field: "requestsPerSecond",
							renderCell: (props: any) => {
								return RenderRLIRate(props);
							},
						},
						{
							headerName: "Expiry date",
							field: "expiresAt",
							renderCell: (props: any) => {
								return RenderRLIExpiry(props);
							},
						},
						{
							headerName: "Transaction",
							field: "hash",
							renderCell: (props: any) => {
								return RenderTxnHash(props, {
									short: true,
									copy: true,
								});
							},
						},
						// {
						// 	headerName: "Expired",
						// 	field: "expired",
						// 	minWidth: width * 0.1,
						// },
						// {
						// 	headerName: "Actions",
						// 	field: "actions",
						// 	minWidth: width * 0.2,
						// 	renderCell: (RLI: any) =>
						// 		renderOwnersRLIsFromActions(RLI),
						// },
					],
					width
				);
			}}
			renderRows={(filteredData: any) => {
				console.log(filteredData);
				return filteredData?.map((item: any, i: number) => {
					return {
						id: i + 1,
						tokenID: item.tokenID,
						requestsPerSecond: item.tokenID,
						expiresAt: item.tokenID,
						hash: item.hash,
						// expired: RLI.isExpired,
						// RLI,
					};
				});
			}}
		/>
	);
};
export default RLIsByOwnerAddress;
