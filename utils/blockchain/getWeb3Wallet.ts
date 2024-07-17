import { ethers } from "ethers";
import { Signer } from "ethers";
import {
	VESUVIUS_APP_CONFIG,
	CHRONICLE_APP_CONFIG,
	YELLOWSTONE_APP_CONFIG,
} from "../../app_config";
import { METAMASK_CHAIN_INFO_BY_NETWORK } from "@lit-protocol/constants";

interface Web3WalletProps {
	wallet: any;
	signer: any;
	addresses: any;
	ownerAddress: any;
}

const defaultProps = {
	wallet: null,
	signer: null,
	addresses: null,
	ownerAddress: null,
};

const getWeb3Wallet = async (
	network: string
): Promise<Web3WalletProps | never> => {
	const web3Provider = window.ethereum;

	console.warn("web3Provider:", web3Provider);

	if (!web3Provider) {
		alert("Please install web3 wallet like Metamask/Brave.");
		return defaultProps;
	}

	try {
		console.log("11 TESTING!");
		await web3Provider.send("wallet_switchEthereumChain", [
			{
				chainId: `0x${METAMASK_CHAIN_INFO_BY_NETWORK[network].chainId
					.toString(16)
					.replace(/^0+/, "")}`,
			},
		]);
	} catch (e) {

		let chainInfo = METAMASK_CHAIN_INFO_BY_NETWORK[network];

		// @ts-ignore
		chainInfo.chainId = `0x${METAMASK_CHAIN_INFO_BY_NETWORK[network].chainId
					.toString(16)
					.replace(/^0+/, "")}`

		await web3Provider.request({
			method: "wallet_addEthereumChain",
			params: [METAMASK_CHAIN_INFO_BY_NETWORK[network]],
		});
	}

	const wallet = new ethers.providers.Web3Provider(web3Provider);

	await wallet.send("eth_requestAccounts", []);

	const signer: Signer = wallet.getSigner();

	const addresses = await wallet.listAccounts();

	const ownerAddress = addresses[0];

	return { wallet, signer, addresses, ownerAddress };
};

export default getWeb3Wallet;
