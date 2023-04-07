import { ethers } from "ethers";
import { Signer } from "ethers";
import { APP_CONFIG } from "../../app_config";

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

const getWeb3Wallet = async (): Promise<Web3WalletProps | never> => {
	const web3Provider = window.ethereum;

	console.warn("web3Provider:", web3Provider);

	if (!web3Provider) {
		alert("Please install web3 wallet like Metamask/Brave.");
		return defaultProps;
	}

	try {
		await web3Provider.send("wallet_switchEthereumChain", [
			{ chainId: APP_CONFIG.NETWORK.params.chainId },
		]);
	} catch (e) {
		await web3Provider.request({
			method: "wallet_addEthereumChain",
			params: [APP_CONFIG.NETWORK.params],
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
