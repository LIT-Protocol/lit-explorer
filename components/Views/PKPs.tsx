import { appendEvenWidths } from "../../utils/mui/mui";
import LoadData from "../ViewModels/LoadData";
import RenderLink from "./MuiRenders/RenderLink";
import RenderPKPToAddress from "./MuiRenders/RenderPKPToAddress";
import RenderPKPToBTC from "./MuiRenders/RenderPKPToBTC";
import RenderPKPToPubKey from "./MuiRenders/RenderPKPToPubKey";

const PKPs = () => {
	// expires in 1 hour from
	const cacheExpire = 60 * 60 * 1000;

	return (
		<LoadData
			height={500}
			debug={false}
			cache={true}
			cacheExpire={cacheExpire}
			title="10 Latest PKPs Minted by other users"
			loadingMessage="Finding the 10 latest minted PKPs..."
			errorMessage="No PKPs found."
			fetchPath={`/api/get-all-pkps`}
			filter={(rawData: any) => {
				console.log("[PKPs] input<rawData>", rawData);
				return rawData?.data?.tokens;
			}}
			renderCols={(width: number) => {
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
						{
							headerName: "BTC Address",
							field: "btc",
							renderCell: (props: any) => {
								return RenderPKPToBTC(props, {
									short: true,
									copy: true,
								});
							},
						},
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
					],
					width
				);
			}}
			renderRows={(filteredData: any) => {
				return filteredData?.map((item: any, i: number) => {
					return {
						id: i + 1,
						tokenId: item,
						address: item,
						btc: item,
						copy: item,
					};
				});
			}}
		/>
	);
};
export default PKPs;
