import { NextPageWithLayout } from "../../pages/_app";
import FormInputFields, { MyFormData, MyProgressI } from "./FormInputFields";
import throwError from "../../utils/throwError";
import { useState } from "react";
import { newObjectState } from "../../utils/clone";
import { useRouter } from "next/router";
import { tryUntil, TryUntilProp } from "../../utils/tryUntil";
import { AppRouter } from "../../utils/AppRouter";
import { useAppContext } from "../Contexts/AppContext";
import { hexToDecimal } from "../../utils/converter";
import { FixedNumber } from "ethers";
import FaucetLink from "../UI/FaucetLink";

const FormMintNewPKP: NextPageWithLayout = () => {
	// -- app context
	const appContext = useAppContext();
	const { contractsSdk } = appContext;
	const router = useRouter();

	// -- states
	const [mintProgress, setMintProgress] = useState<MyProgressI>({
		progress: 0,
		message: "",
	});
	const [mintButtonText, setMintButtonText] = useState("Mint");
	const [mintedPKPId, setMintedPKPId] = useState<any>();

	// -- (void) redirect
	const redirect = async () => {
		const page = AppRouter.getPage(mintedPKPId);
		router.push(page);
		return;
	};

	// -- (void) mint
	const mint = async (formData: MyFormData) => {
		console.log("[mint] formData:", formData);

		// ===== STEP =====
		setMintProgress(
			newObjectState(mintProgress, {
				progress: 50,
				message: "Getting mint cost...",
			})
		);

		let mintCost = null;

		try {
			mintCost = await contractsSdk.pkpNftContract.read.mintCost();
		} catch (e: any) {
			console.log(`Unable to get mint cost due to: ${e.message}`);
			return;
		}

		if (!mintCost) {
			console.log(`Unable to get mint cost`);
			return;
		}

		console.log("Estimated cost:", mintCost);

		const estCost = FixedNumber.fromValue(mintCost, 18).toString();

		// ===== STEP =====
		try {
			setMintProgress(
				newObjectState(mintProgress, {
					progress: 75,
					message: `Estimated cost: ${estCost} LIT. Minting...`,
				})
			);

			const mintRes = await contractsSdk.pkpNftContract.write.mintNext(
				2,
				{
					value: mintCost,
					gasLimit: 5000000,
				}
			);

			const res: any = await mintRes.wait();
			console.log("res:", res);

			let events = "events" in res ? res.events : res.logs;
			console.log("events:", events);

			let tokenId = hexToDecimal(events[1].topics[3]);

			console.log("Your tokenId:", tokenId);

			setMintedPKPId(tokenId);

			const isRouted = true;

			console.log("isRouted:", isRouted);

			setMintProgress(
				newObjectState(mintProgress, {
					progress: 100,
					message: "Successfully minted a PKP NFT!",
				})
			);

			setMintButtonText("Go view your PKP!");
		} catch (e: any) {
			setMintProgress(
				newObjectState(mintProgress, {
					progress: 0,
					message: "",
				})
			);
			let errMsg = `Unable to mint PKP NFT due to: ${e.message}.`;
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

	/**
	 * -- (void) when submit button is clicked, decide which
	 * action to perform based on the mint progress
	 *
	 * @param { MyFormData } formData
	 * @returns { void }
	 */
	const onSubmit = async (formData: MyFormData): Promise<void> => {
		const progress = mintProgress?.progress ?? 0;

		// when progress is 100%
		if (progress >= 100) {
			await redirect();
			return;
		}

		await mint(formData);
	};

	return (
		<>
			<FaucetLink />

			<FormInputFields
				title={"Mint New PKP"}
				buttonText={mintButtonText}
				// fields={FormMintNewPKPFields}
				onSubmit={onSubmit}
				progress={mintProgress}
				fullWidth={true}
			/>
		</>
	);
};

export default FormMintNewPKP;
