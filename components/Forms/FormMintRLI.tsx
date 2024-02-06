import throwError from "../../utils/throwError";
import { useAppContext } from "../Contexts/AppContext";
import FormInputFields, { MyFieldType, MyProgressI } from "./FormInputFields";
import moment from "moment";
import { MultiETHFormat } from "../../utils/converter";
import { useState } from "react";
import { wait } from "../../utils/utils";
import { FixedNumber } from "ethers";

const CHAIN_TX_URL = "https://chain.litprotocol.com/tx/";

const FormMintRLI = ({
	onMint,
}: {
	onMint?(cost: MultiETHFormat, tx: any): void;
}) => {
	// (app context)
	const { contractsSdk } = useAppContext();

	const [progress, setProgress] = useState<MyProgressI>({
		progress: 0,
		message: "",
	});

	const [token, setToken] = useState<any>({
		tokenId: "",
		tx: "",
	});

	// (event) handle click
	const handleClick = async (res: any): Promise<void> => {

		setProgress({
			progress: 50,
			message: "Minting...	",
		});

		console.log("res:", res);

		const requestsPerDay = parseInt((res.find((item: any) => item.id === "Requests per day")).data);
		let expirationDate = (res.find((item: any) => item.id === MyFieldType.DATE_PICKER)).data;
		console.log("requestsPerDay:", requestsPerDay);
		console.log("expirationDate:", expirationDate);

		// calculate how many requests per minute
		const requestsPerMinute = requestsPerDay / 1440;
		console.log("requestsPerMinute:", requestsPerMinute);

		// calculate days until expiration date
		const today = moment();
		const expiration = moment(expirationDate);
		const daysUntilExpiration = expiration.diff(today, "days");

		console.log("daysUntilExpiration:", daysUntilExpiration);

		// selected date must be at least 2 days from now
		if (daysUntilExpiration < 2) {
			throwError(`Days until UTC expiration must be at least 2 days from current UTC time. Received ${daysUntilExpiration} days.`);

			setProgress({
				progress: 0,
				message: "Calculating cost...",
			});

			return;
		}

		try {
			console.log("*** minting capacity credits NFT ***");
			const { capacityTokenIdStr, rliTxHash } = await contractsSdk.mintCapacityCreditsNFT({
				requestsPerDay: requestsPerDay, // 10 request per minute
				daysUntilUTCMidnightExpiration: daysUntilExpiration,
			});

			console.log("capacityTokenIdStr:", capacityTokenIdStr);
			console.log("rliTxHash:", rliTxHash);

			setToken({
				tokenId: capacityTokenIdStr,
				tx: rliTxHash,
			});

			setProgress({
				progress: 100,
				message: `
				Successfully minted a Capacity Credits NFT!`,
			});

		} catch (e: any) {
			console.log("error:", e);
			throwError(`Unable to mint Capacity Credits NFT due to: ${e.message}. Please try again.`);

			setProgress({
				progress: 0,
				message: "Calculating cost...",
			});
		}
	};

	return (
		<div className="mt-12 mb-12">
			{token.tokenId && (
				<div className="mt-12 res-result">
					<div className="mb-12">🚀 Your Capacity Credits NFT</div>
					<div className="mb-12">
						<div>Token ID: {token.tokenId}</div>
						<div>Transaction: <a href={`${CHAIN_TX_URL}${token.tx}`} target="_blank" rel="noreferrer">
							{CHAIN_TX_URL}{token.tx}</a></div>
					</div>
				</div>
			)}

			<FormInputFields
				title="Buy Capacity Credits"
				fields={[
					{
						title: "Requests per day",
						label: "",
						default: 14400,
					},
					{
						title: MyFieldType.DATE_PICKER,
						type: MyFieldType.DATE_PICKER,
						label: "UTC Midnight Expiration Date",
					},
				]}
				buttonText="Buy Capacity Credits"
				onSubmit={handleClick}
				progress={progress}
			/>
		</div>
	);
};
export default FormMintRLI;
