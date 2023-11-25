import throwError from "../../utils/throwError";
import { useAppContext } from "../Contexts/AppContext";
import FormInputFields, { MyFieldType, MyProgressI } from "./FormInputFields";
import moment from "moment";
import { MultiETHFormat } from "../../utils/converter";
import { useState } from "react";
import { wait } from "../../utils/utils";
import { FixedNumber } from "ethers";

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

	// (event) handle click
	const handleClick = async (res: any): Promise<void> => {
		// -- validate
		if (res.length < 2) {
			throwError("You must fill in all fields.");
			return;
		}

		const requestsPerSecond = parseInt(res[0].data);
		const requestsPerKilosecond = requestsPerSecond * 1000;
		const expiresAt = moment(res[1].data).unix();

		console.log("Requests per second:", requestsPerSecond);
		console.log("Requests per kilosecond:", requestsPerKilosecond);
		console.log("Expires at:", expiresAt);

		setProgress({
			progress: 50,
			message: "Calculating cost...",
		});
		let cost;

		try {
			cost = await contractsSdk.rateLimitNftContract.read.calculateCost(
				requestsPerKilosecond,
				expiresAt
			);
		} catch (e: any) {
			setProgress({
				progress: 0,
				message: "",
			});
			throwError(
				`Unable to calculate cost for Capacity Credits NFT due to: ${e.message}. Please try again.`
			);
			return;
		}

		console.log("Estimated cost:", cost);

		const estCost = FixedNumber.fromValue(cost, 18).toString();

		setProgress({
			progress: 75,
			message: `Estimated cost: ${estCost} LIT. Minting...`,
		});

		try {
			// -- mint
			const mintRes = await contractsSdk.rateLimitNftContract.write.mint(
				expiresAt,
				{
					value: cost,
				}
			);
			const mintWait = await mintRes.wait();
			console.log("res:", mintWait);

			setProgress({
				progress: 100,
				message: "Successfully minted a Capacity Credits NFT!",
			});
		} catch (e: any) {
			setProgress({
				progress: 0,
				message: "",
			});
			let errMsg = `Unable to mint Capacity Credits NFT due to: ${e.message}.`;
			if (e.code === -32603) {
				errMsg += ` Please make sure your wallet has ${
					estCost?.length > 0 ? `at least ${estCost}` : `enough`
				} LIT to complete the transaction. Visit the faucet at https://faucet.litprotocol.com/`;
			}
			throwError(errMsg);
			return;
		}

		return;
	};

	return (
		<div className="mt-12 mb-12">
			<FormInputFields
				title="Buy Capacity Credits"
				fields={[
					{
						title: "Requests per second",
						label: "",
					},
					{
						title: MyFieldType.DATE_TIME_PICKER,
						type: MyFieldType.DATE_TIME_PICKER,
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
