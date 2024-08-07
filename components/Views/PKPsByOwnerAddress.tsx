import { heyShorty } from "../../utils/converter";
import { appendEvenWidths } from "../../utils/mui/mui";
import { useAppContext } from "../Contexts/AppContext";
import LoadData from "../ViewModels/LoadData";
import RenderDate from "./MuiRenders/RenderDate";
import RenderLink from "./MuiRenders/RenderLink";
import RenderPKPToAddress from "./MuiRenders/RenderPKPToAddress";
import RenderPKPToBTC from "./MuiRenders/RenderPKPToBTC";
import RenderPKPToPubKey from "./MuiRenders/RenderPKPToPubKey";
import RenderTxnHash from "./MuiRenders/RenderTxnHash";

interface PKPsByOwnerAddressOptions {
	title?: string;
	loadingMessage?: string;
	errorMessage?: any;
	height?: number;
}

const PKPsByOwnerAddress = ({
	ownerAddress,
	options,
}: {
	ownerAddress: string;
	options?: PKPsByOwnerAddressOptions;
}) => {
	const { network, appConfig } = useAppContext();

	return (
		<div>
			{/* network: {network} */}
			<LoadData
				height={options?.height}
				cache={false}
				key={ownerAddress.toString()}
				debug={false}
				title={
					options?.title ??
					`PKPs by a given address: ${heyShorty(ownerAddress, 4)}`
				}
				errorMessage={options?.errorMessage ?? "No PKPs found."}
				loadingMessage={
					options?.loadingMessage ??
					`Loading a list of PKPs by a given address...`
				}
				fetchPath={`/api/get-pkps-by-address/${ownerAddress}?network=${network}`}
				filter={(rawData: any) => {
					console.log("[PKPsByOwnerAddress] input<rawData>", rawData);
					return rawData.data;
				}}
				renderCols={(width: any) => {
					// return [];
					return appendEvenWidths(
						[
							{
								headerName: "PKP Token ID",
								field: "tokenId",
								renderCell: (props: any) => {
									return RenderLink(props, {
										short: true,
										copy: true,
									});
								},
							},
							{
								headerName: "ETH Address",
								field: "address",
								renderCell: (props: any) => {
									return RenderPKPToAddress(props, {
										short: true,
										copy: true,
									});
								},
							},
							// {
							// 	headerName: "BTC Address",
							// 	field: "btc",
							// 	renderCell: (props: any) => {
							// 		return RenderPKPToBTC(props, {
							// 			short: true,
							// 			copy: true,
							// 		});
							// 	},
							// },
							{
								headerName: "Public Key",
								field: "copy",
								renderCell: (props: any) => {
									return RenderPKPToPubKey(props, {
										short: true,
										copy: true,
									});
								},
							},
							// {
							// 	headerName: "Acquired Date",
							// 	field: "date",
							// 	renderCell: RenderDate,
							// },
							// { headerName:"From", field: "from"},
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
						],
						width
					);
				}}
				renderRows={(filteredData: any) => {
					// return filteredData;
					return filteredData?.map((item: any, i: number) => {
						return {
							id: i + 1,
							tokenId: item.tokenID,
							address: item.tokenID,
							// date: item.timeLastUpdated,
							// from: item.from === '0x0000000000000000000000000000000000000000' ? 'Minted' : pkp.from,
							hash: item.hash,
						};
					});
				}}
			/>
		</div>
	);
};
export default PKPsByOwnerAddress;
