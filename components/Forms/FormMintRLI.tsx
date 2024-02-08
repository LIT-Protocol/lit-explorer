import throwError from "../../utils/throwError";
import { useAppContext } from "../Contexts/AppContext";
import FormInputFields, { MyFieldType, MyProgressI } from "./FormInputFields";
import moment from "moment";
import { MultiETHFormat } from "../../utils/converter";
import { useState } from "react";
import { wait } from "../../utils/utils";
import { FixedNumber } from "ethers";
import FaucetLink from "../UI/FaucetLink";
import {
	requestsToDay,
	requestsToSecond,
	requestsToKilosecond,
} from "@lit-protocol/contracts-sdk";
import NetworkBasedMessage from "../UI/NetworkBasedMessage";

const CHAIN_TX_URL = "https://chain.litprotocol.com/tx/";

const FormMintRLI = ({
	onMint,
}: {
	onMint?(cost: MultiETHFormat, tx: any): void;
}) => {
	// (app context)
	const { contractsSdk, network } = useAppContext();

	const [progress, setProgress] = useState<MyProgressI>({
		progress: 0,
		message: "",
	});

	const [token, setToken] = useState<any>({
		tokenId: "",
		tx: "",
	});

	const [conversionData, setConversionData] = useState<any>();

	// (event) handle click
	const handleClick = async (res: any): Promise<void> => {

		setProgress({
			progress: 50,
			message: "Minting...	",
		});


		// remove undefined
		res = res.filter((item: any) => item !== undefined);
		console.log("res:", res);


		const requestsPerKilosecond = parseInt((res.find((item: any) => item.id === "Requests per kilosecond")).data);
		let expirationDate = (res.find((item: any) => item.id === 'UTC Midnight Expiration Date')).data;
		console.log("requestsPerKilosecond:", requestsPerKilosecond);
		console.log("expirationDate:", expirationDate);

		// calculate how many requests per minute
		// const requestsPerMinute = requestsPerDay / 1440;
		// console.log("requestsPerMinute:", requestsPerMinute);

		// calculate days until expiration date
		const today = moment();
		const expiration = moment(expirationDate);
		const daysUntilExpiration = expiration.diff(today, "days");

		console.log("daysUntilExpiration:", daysUntilExpiration);

		// selected date must be at least 2 days from now
		if (daysUntilExpiration < 1) {
			throwError(`Days until UTC expiration must be at least 1 day from current UTC time. Received ${daysUntilExpiration} days.`);

			setProgress({
				progress: 0,
				message: "Calculating cost...",
			});

			return;
		}

		const maxRequestsPerKilosecond = await contractsSdk.rateLimitNftContract.read.maxRequestsPerKilosecond();

		if (requestsPerKilosecond > maxRequestsPerKilosecond.toNumber()) {
			throwError(`Requests per kilosecond must be less than or equal to ${maxRequestsPerKilosecond.toNumber()}. Received ${requestsPerKilosecond}.`);

			setProgress({
				progress: 0,
				message: "Calculating cost...",
			});

			return;
		}

		try {
			console.log("*** minting capacity credits NFT ***");
			const { capacityTokenIdStr, rliTxHash } = await contractsSdk.mintCapacityCreditsNFT({
				requestsPerKilosecond,
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
			console.log(e);
			throwError(`Unable to mint Capacity Credits NFT due to: ${e.message}. Please try again.`);

			setProgress({
				progress: 0,
				message: "Calculating cost...",
			});
		}
	};

	return (
		<div className="mt-12 mb-12">


			{
				(network == 'manzano' || network == 'habanero') ? (
					<FaucetLink />
				) : ''
			}

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

			<NetworkBasedMessage network={network} type="general" />

			{
				(network == 'manzano' || network == 'habanero') ? (
					<FormInputFields
						title="Buy Capacity Credits"
						fields={[
							{
								type: MyFieldType.TEXT_FIELD,
								title: "Requests per kilosecond",
								default: 14400,
							},
							{
								type: MyFieldType.CUSTOM,
								render: (field: any, i: number) => {
									return !conversionData ? <div key={i}></div> : (
										<div key={i} className="mb-12 info">
											<div>≡ {conversionData.requestsPerDay} req/day</div>
										</div>
									);
								}
							},
							{
								type: MyFieldType.DATE_PICKER,
								title: "UTC Midnight Expiration Date",
							},
						]}
						buttonText="Buy Capacity Credits"
						onSubmit={handleClick}
						onChange={(res: any) => {

							// remove undefined
							res = res.filter((item: any) => item !== undefined);

							const requestsPerKilosecond = res.find((item: any) => item.id === "Requests per kilosecond").data;

							const requestsPerDay = requestsToDay({ period: 'kilosecond', requests: requestsPerKilosecond });

							const requestsPerSecond = requestsToSecond({
								period: 'kilosecond',
								requests: requestsPerKilosecond,
							})

							const conversionData = {
								requestsPerKilosecond: parseInt(requestsPerKilosecond),
								requestsPerDay,
								requestsPerSecond,
							}

							setConversionData(conversionData);
						}}
						progress={progress}
					/>
				) : ''
			}

		</div>
	);
};
export default FormMintRLI;
