import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppRouter } from "../../../utils/AppRouter";
import { heyShorty, pub2Addr } from "../../../utils/converter";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";
const { toChecksumAddress } = require("ethereum-checksum-address");

export interface MyOptions {
	copy?: boolean;
	short?: boolean;
}

export const Address = ({
	pkpId,
	options,
}: {
	pkpId: number;
	options: MyOptions;
}) => {
	// -- (app context)
	const { contractsSdk } = useAppContext();
	const router = useRouter();

	// -- (states)
	const [address, setAddress] = useState<string>();

	// -- (mounted)
	useEffect(() => {
		if (!contractsSdk) return;

		(async () => {
			if (address) return;

			const _pubKey =
				await contractsSdk.pubkeyRouterContract.read.getPubkey(pkpId);

			const _address = "0x" + pub2Addr(_pubKey);

			console.log("_address:", _address);

			const _checksummed = toChecksumAddress(_address);

			setAddress(_checksummed);
		})();
	}, [contractsSdk]);

	// -- (validation)
	if (!address) return <>Loading...</>;

	// -- (render) render value
	const renderValue = (address: string) => {
		return (
			<>
				<div className="flex justify-cell">
					<div
						id={`link-${address}`}
						className="flex-content link"
						onClick={() => router.push(AppRouter.getPage(address))}
					>
						{options?.short ? heyShorty(address) : address}
					</div>
					{options?.copy ? <Copy value={address} /> : ""}
				</div>
			</>
		);
	};

	// -- (finally)
	return <div className="flex justify-cell">{renderValue(address)}</div>;
};

const RenderPKPToAddress = (
	props: GridRenderCellParams,
	options: MyOptions
) => {
	const pkpId = props.row.tokenId;

	return <Address pkpId={pkpId} options={options} />;
};

export default RenderPKPToAddress;
