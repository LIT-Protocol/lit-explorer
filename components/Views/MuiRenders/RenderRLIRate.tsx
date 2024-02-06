import { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useAppContext } from "../../Contexts/AppContext";

export interface MyOptions {
	copy?: boolean;
	short?: boolean;
}

export const Rate = ({
	tokenId,
	options,
}: {
	tokenId: number;
	options?: MyOptions;
}) => {
	// -- (app context)
	const { contractsSdk } = useAppContext();

	// -- (states)
	const [requestsPerSecond, setRequestsPerSecond] = useState<number>();

	// -- (mounted)
	useEffect(() => {
		if (!contractsSdk) return;

		(async () => {
			if (requestsPerSecond) return;

			const rateLimit =
				await contractsSdk.rateLimitNftContract.read.capacity(tokenId);
			const requestsPerKilosecond =
				rateLimit.requestsPerKilosecond.toNumber();

			setRequestsPerSecond(requestsPerKilosecond / 1000);

		})();
	}, [contractsSdk]);

	// -- (validation)
	if (!requestsPerSecond) return <>Loading...</>;

	// -- (finally)
	return (
		<div className="flex justify-cell">
			<p>{requestsPerSecond}</p>
		</div>
	);
};

const RenderRLIRate = (props: GridRenderCellParams, options?: MyOptions) => {
	const tokenId = props.row.tokenID;

	return <Rate tokenId={tokenId} options={options} />;
};

export default RenderRLIRate;
