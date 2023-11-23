import { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useAppContext } from "../../Contexts/AppContext";

export interface MyOptions {
	copy?: boolean;
	short?: boolean;
}

export const Expiry = ({
	tokenId,
	options,
}: {
	tokenId: number;
	options?: MyOptions;
}) => {
	// -- (app context)
	const { contractsSdk } = useAppContext();

	// -- (states)
	const [expiresAt, setExpiresAt] = useState<string>();

	// -- (mounted)
	useEffect(() => {
		if (!contractsSdk) return;

		(async () => {
			if (expiresAt) return;

			const rateLimit =
				await contractsSdk.rateLimitNftContract.read.capacity(tokenId);

			// Convert Unix timestamp to readable date and time
			const timestamp = rateLimit.expiresAt.toNumber();
			const date = new Date(timestamp * 1000);
			const expiryDate = date.toLocaleString();

			setExpiresAt(expiryDate);
		})();
	}, [contractsSdk]);

	// -- (validation)
	if (!expiresAt) return <>Loading...</>;

	// -- (finally)
	return (
		<div className="flex justify-cell">
			<p>{expiresAt}</p>
		</div>
	);
};

const RenderRLIExpiry = (props: GridRenderCellParams, options?: MyOptions) => {
	const tokenId = props.row.tokenID;

	return <Expiry tokenId={tokenId} options={options} />;
};

export default RenderRLIExpiry;
