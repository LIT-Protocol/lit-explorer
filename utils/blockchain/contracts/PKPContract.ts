import { Contract, ethers } from "ethers";
import { ContractProps } from "./ContractI";
import { VESUVIUS_APP_CONFIG, CHRONICLE_APP_CONFIG } from "../../../app_config";
import { getContract } from "./getContract";
import { hexToDecimal, MultiETHFormat, wei2eth } from "../../converter";

/**
 * (CLASS) Entry point of accessing the smart contract functionalities
 */
export class PKPContract {
	contract: Contract;
	read: ReadPKPContract;
	write: WritePKPContract;

	constructor() {
		this.contract = {} as Contract;
		this.read = {} as ReadPKPContract;
		this.write = {} as WritePKPContract;
	}

	/**
	 *
	 * Connection must perform before executing any smart contract calls
	 *
	 * @param { Signer } signer
	 * @return { void }
	 */
	connect = async (props?: ContractProps): Promise<void> => {
		const appConfig =
			props?.network === "datil-dev" || props?.network === "datil-test"
				? VESUVIUS_APP_CONFIG
				: CHRONICLE_APP_CONFIG;

		const config = {
			network: props?.network ?? appConfig.NETWORK_NAME,
			signer: props?.signer,
			contractAddress:
				props?.contractAddress ?? appConfig.PKP_NFT_CONTRACT.ADDRESS,
		};

		const _contract = await getContract(config);

		if (!_contract) return;

		this.contract = _contract;

		console.log("[📝 PKPContract] connect input<config>:", config);

		this.read = new ReadPKPContract(this.contract);
		this.write = new WritePKPContract(this.contract);

		const mintCost = await this.read.mintCost();
		console.log("[📝 PKPContract] connect mintCost:", mintCost);
	};
}

/**
 * (READ CLASS) All read functions on smart contract
 */
export class ReadPKPContract {
	contract: Contract;

	constructor(contract: Contract) {
		this.contract = contract;
	}

	/**
	 *
	 * Get mint cost for PKP
	 *
	 * @returns { Promise<MultiETHFormat> }
	 */
	mintCost = async (): Promise<MultiETHFormat> => {
		const mintCost = await this.contract.mintCost();

		return wei2eth(mintCost);
	};

	/**
	 * (IERC721Enumerable)
	 *
	 * Get all PKPs by a given address
	 *
	 * @param { string } ownerAddress
	 * @returns { Array<string> } a list of PKP NFTs
	 */
	getTokensByAddress = async (
		ownerAddress: string
	): Promise<Array<string>> => {
		// -- validate
		if (!ethers.utils.isAddress(ownerAddress)) {
			throw new Error(
				`Given string is not a valid address "${ownerAddress}"`
			);
		}

		let tokens = [];

		for (let i = 0; ; i++) {
			let token;

			try {
				token = await this.contract.tokenOfOwnerByIndex(
					ownerAddress,
					i
				);

				token = hexToDecimal(token.toHexString());

				tokens.push(token);
			} catch (e) {
				console.log(`[getTokensByAddress] Ended search on index: ${i}`);
				break;
			}
		}

		return tokens;
	};

	/**
	 * (IERC721Enumerable)
	 *
	 * Get the x latest number of tokens
	 *
	 * @param { number } lastNumberOfTokens
	 *
	 * @returns { Array<string> } a list of PKP NFTs
	 *
	 */
	getTokens = async (lastNumberOfTokens: number): Promise<Array<string>> => {
		let tokens = [];

		for (let i = 0; ; i++) {
			if (i >= lastNumberOfTokens) {
				break;
			}

			let token;

			try {
				token = await this.contract.tokenByIndex(i);

				token = hexToDecimal(token.toHexString());

				tokens.push(token);
			} catch (e) {
				console.log(`[getTokensByAddress] Ended search on index: ${i}`);
				break;
			}
		}

		return tokens;
	};
}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WritePKPContract {
	contract: Contract;

	constructor(contract: Contract) {
		this.contract = contract;
	}

	mint = async (mintCost: { value: any }) => {
		const tx = await this.contract.mintNext(
			VESUVIUS_APP_CONFIG.ECDSA_KEY,
			mintCost
		);

		const res = await tx.wait();

		window.mint = res;

		console.warn("[DEBUG] window.mint:", window.mint);

		console.log("res:", res);

		let tokenIdFromEvent;

		// celo
		// tokenIdFromEvent = res.events[0].topics[3]

		// mumbai
		// tokenIdFromEvent = res.events[1].topics[3];

		// Lit Chain
		tokenIdFromEvent = res.events[0].args.tokenId;

		// convert big number to decimal
		tokenIdFromEvent = hexToDecimal(tokenIdFromEvent.toHexString());

		console.warn("tokenIdFromEvent:", tokenIdFromEvent);

		return { tx, tokenId: tokenIdFromEvent };
	};
}
