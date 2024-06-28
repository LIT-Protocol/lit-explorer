import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import { asyncForEachReturn } from "../../utils/utils";
import { useAppContext } from "../Contexts/AppContext";
import Copy from "../UI/Copy";

const SelectionPermittedPKPs = ({
	title,
	onSelect,
	refresh,
	ipfsId,
	onDefaultToken,
}: {
	title?: string;
	label?: string;
	onSelect?(data: any): void;
	refresh?: number;
	ipfsId?: string;
	onDefaultToken?(token: string): void;
}) => {
	// -- (app context)
	const { appConfig } = useAppContext();

	// -- (state)
	const [tokens, setTokens] = useState<Array<string>>();
	const [selectedToken, setSelectedToken] = useState<string>();

	// -- (mounted)
	useEffect(() => {
		// -- debug
		if (refresh) {
			console.log("[SelectionPermittedPKPs] refresh:", refresh);
		}

		(async () => {
			await fetchTokens();
		})();
	}, [refresh]);

	// -- (void)
	const fetchTokens = async () => {
		const { ownerAddress } = await getWeb3Wallet(
			appConfig.NETWORK.params.network
		);
		return;
		const _tokens: Array<string> =
			await pkpContract.read.getTokensByAddress(ownerAddress);
		console.log("[fetchTokens] output<_tokens>:", _tokens);

		let permitted = await asyncForEachReturn(
			_tokens,
			async (pkpId: string) => {
				const isPermitted =
					await pkpPermissionsContract.read.isPermittedAction(
						pkpId,
						ipfsId as string
					);

				console.log("isPermitted:", isPermitted);

				const filteredTokens = !isPermitted ? null : pkpId;

				return filteredTokens;
			}
		);
		permitted = permitted.filter((pkpId) => pkpId != null);

		console.log("[permitted] output<permitted>:", permitted);

		setTokens(permitted);

		// -- only run the first time
		if (!refresh) {
			setSelectedToken(permitted[0]);

			if (onDefaultToken) {
				onDefaultToken(permitted[0]);
			}
		}
	};

	// -- (event)
	const handleChange = (e: any) => {
		const _token = e.target.value;

		setSelectedToken(_token);

		// -- callback
		if (onSelect) {
			onSelect(_token);
		}
	};

	// -- (validations)
	if (!tokens) return <>No PKPs found.</>;
	if (!ipfsId) return <>No ipfsId found.</>;

	return (
		<div className="flex">
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">
					{title ?? "TITLE"}
				</InputLabel>

				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={selectedToken}
					label={title ?? "TITLE"}
					onChange={handleChange}
				>
					{tokens.map((pkpId) => {
						return (
							<MenuItem key={pkpId} value={pkpId}>
								{pkpId}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<Copy value={selectedToken as any} />
		</div>
	);
};
export default SelectionPermittedPKPs;
