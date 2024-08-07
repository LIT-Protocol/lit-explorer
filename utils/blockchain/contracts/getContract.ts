import { Contract, ContractInterface, ethers, Signer, Wallet } from "ethers";
import { VESUVIUS_APP_CONFIG, CHRONICLE_APP_CONFIG } from "../../../app_config";

/**
 *
 * Get the signer of the given network, otherwise automatically
 * generates a private key to create a signer
 *
 * @param { string } network
 * @return { Signer }
 */
export const getSigner = async (network: string): Promise<Signer> => {
	console.log("[getSigner] network:", network);

	const appConfig =
		(network === "datil-dev" || network === "datil-test") ? VESUVIUS_APP_CONFIG : CHRONICLE_APP_CONFIG;

	let signer: Signer;

	// const randomPrivateKey = ethers.Wallet.createRandom().privateKey;

	const randomPrivateKey =
		"4ecd2d6fc9153d39b2883b8ebb59de9c2a469a5b2d07d31039e09600585ae805";

	const provider = new ethers.providers.JsonRpcProvider(
		appConfig.NETWORK.params.rpcUrls[0]
	);

	signer = new ethers.Wallet(randomPrivateKey, provider);

	return signer;

	// -- (otherwise)
	// throw new Error(`No signer is found in network "${network}".`);
};

export const getContractFromAppConfig = (network: string, address: string) => {
	const contracts: any = [];

	const appConfig =
		(network === "datil-dev" || network === "datil-test") ? VESUVIUS_APP_CONFIG : CHRONICLE_APP_CONFIG;

	Object.entries(appConfig).forEach((e) => {
		const item: any = e[1];

		if (item) {
			if (item["ABI"] !== undefined) {
				contracts.push(item);
			}
		}
	});

	let contract = contracts.find((item: any) => item.ADDRESS === address);

	return contract;
};

/**
 *
 * Get the ABI code from the given API and contract address
 *
 * @property { string } network
 * @property { string } contractAddress
 *
 * @return { Promise<ContractInterface } ABI
 */
export const getABI = async ({
	network,
	contractAddress,
}: {
	network: string;
	contractAddress?: string;
}): Promise<ContractInterface> => {
	// console.log("--- getABI ---");

	let ABI;

	if (!contractAddress) {
		throw new Error("Contract address cannot be enpty");
	}

	try {
		// const ABI_API = selectedNetwork.ABI_API + contractAddress;

		// const data = await fetch(ABI_API)
		// .then((res) => res.json())
		// .then((data) => data.result);

		// ABI = data;
		ABI = getContractFromAppConfig(network, contractAddress).ABI;

		// -- using fallback
		// if( data.includes('Max rate limit reached')){
		//     console.warn("Using fallback for contract:", contractAddress);
		//     let found : any = Object.entries(ABIsFallback).find((item) => item[0].toLowerCase() == contractAddress.toLocaleLowerCase());

		//     ABI = JSON.parse(found[1]);
		// }

		// console.log("ABI from getABI:", ABI);

		// -- finally
	} catch (e: any) {
		throw new Error("Error while fetching ABI from API:", e);
	}

	return ABI;
};

/**
 *
 * Get the ABI code of a contract by network
 *
 * @property { string } network
 * @property { Signer } signer
 * @property { string } contractAddress
 *
 * @return { Contract } ABI in json format
 */
export const getContract = async (props: {
	network: string;
	signer?: Signer;
	contractAddress?: string;
}): Promise<Contract | undefined> => {
	let signer: Signer = props?.signer ?? (await getSigner(props.network));

	let ABI: ContractInterface | never;

	const _contractAddress = props.contractAddress ?? "";

	if (_contractAddress === "") {
		console.error("Contract address cannot be empty");
		return;
	}

	// -- If it's running from Node, don't bother using local storage
	if (typeof window === "undefined") {
		ABI = await getABI({
			network: props.network,
			contractAddress: props.contractAddress,
		});
	} else {
		// -- if ABI exists in local storage
		if (!localStorage.getItem(_contractAddress)) {
			ABI = await getABI({
				network: props.network,
				contractAddress: _contractAddress,
			});

			localStorage.setItem(_contractAddress, JSON.stringify(ABI));

			// -- if ABI does NOT exist in local storage
		} else {
			const data = localStorage.getItem(_contractAddress);
			const parsed = JSON.parse(data ?? "");
			ABI = parsed as ContractInterface;
		}
	}

	// -- validate: check contract is verified
	if (ABI === "Contract source code not verified") {
		throw new Error(
			`Contract source code not verified for ${_contractAddress}`
		);
	}

	// console.log("_contractAddress:", _contractAddress);

	// console.log("Find object...");

	// -- finally, get the contract instance
	let contract;

	try {
		contract = new ethers.Contract(_contractAddress, ABI, signer);
	} catch (e: any) {
		throw new Error("Error creating contract instance:", e);
	}

	return contract;
};
