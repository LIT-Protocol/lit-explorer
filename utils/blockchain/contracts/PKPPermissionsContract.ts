import { BigNumber, Contract, ethers } from "ethers";
import { ContractProps } from "./ContractI";
import {
	CHRONICLE_APP_CONFIG,
	SupportedNetworks,
	VESUVIUS_APP_CONFIG,
	YELLOWSTONE_APP_CONFIG,
} from "../../../app_config";
import { getContract } from "./getContract";
import {
	decimalTohex,
	hexToDecimal,
	MultiETHFormat,
	wei2eth,
} from "../../converter";
import { asyncForEach } from "../../utils";
import { Either } from "monet";
import { getBytesFromMultihash } from "../../ipfs/ipfsHashConverter";
import { RouterContract } from "./RouterContract";
import { tryUntil } from "../../tryUntil";
import { networkConfigMap } from "./utils";

/**
 * (CLASS) Entry point of accessing the smart contract functionalities
 */
export class PKPPermissionsContract {
	contract: Contract;
	read: ReadPKPPermissionsContract;
	write: WritePKPPermissionsContract;

	constructor() {
		this.contract = {} as Contract;
		this.read = {} as ReadPKPPermissionsContract;
		this.write = {} as WritePKPPermissionsContract;
	}

	/**
	 *
	 * Connection must perform before executing any smart contract calls
	 *
	 * @param { Signer } signer
	 * @return { void }
	 */
	connect = async (props?: ContractProps): Promise<void> => {
		const appConfig = networkConfigMap[props?.network!];

		const config = {
			network: props?.network ?? appConfig.NETWORK_NAME,
			signer: props?.signer,
			contractAddress:
				props?.contractAddress ??
				appConfig.PKP_PERMISSIONS_CONTRACT.ADDRESS,
		};

		const _contract = await getContract(config);

		if (!_contract) return;

		this.contract = _contract;

		console.log(
			"[📝 PKPPermissionsContract] connect input<config>:",
			config
		);

		this.read = new ReadPKPPermissionsContract(this.contract);
		this.write = new WritePKPPermissionsContract(this.contract);
	};
}

/**
 * (READ CLASS) All read functions on smart contract
 */
export class ReadPKPPermissionsContract {
	contract: Contract;

	constructor(contract: Contract) {
		this.contract = contract;
	}

	/**
	 *
	 * Check if an address is permitted
	 *
	 * @param { number } pkpId
	 * @param { string } address
	 *
	 * @returns { Promise<boolean> }
	 */
	isPermittedAddress = async (
		pkpId: number,
		address: string
	): Promise<boolean> => {
		const pkpId_hex = decimalTohex(pkpId);

		console.log("pkpId:", pkpId);
		console.log("address:", address);

		const bool = await this.contract.isPermittedAddress(pkpId, address);

		return bool;
	};

	/**
	 *
	 * Get all permitted addresses
	 *
	 * @param { any } tokenId
	 *
	 * @returns { Promise<Array<string>> }
	 */
	getPermittedAddresses = async (tokenId: any): Promise<Array<string>> => {
		console.log("[getPermittedAddresses] input<tokenId>:", tokenId);

		let addresses;

		const maxTries = 5;
		let tries = 0;

		while (tries < maxTries) {
			try {
				addresses = await this.contract.getPermittedAddresses(tokenId);
				if (addresses.length <= 0) {
					await new Promise((resolve) => setTimeout(resolve, 1000));
					tries++;
					continue;
				} else {
					break;
				}
			} catch (e: any) {
				console.log(
					`[getPermittedAddresses] error<e.message | ${tries}>:`,
					e.message
				);
				tries++;
			}
		}

		return addresses;
	};

	/**
	 *
	 * Get permitted action
	 *
	 * @param { any } id
	 *
	 * @returns { Promise<Array<any>> }
	 *
	 */
	getPermittedActions = async (id: any): Promise<Array<any>> => {
		// const actions = await this.contract.getPermittedActions(id);

		let actions;

		const maxTries = 5;
		let tries = 0;

		while (tries < maxTries) {
			try {
				actions = await this.contract.getPermittedActions(id);

				if (actions.length <= 0) {
					await new Promise((resolve) => setTimeout(resolve, 1000));
					tries++;
					continue;
				} else {
					break;
				}
			} catch (e: any) {
				console.log(
					`[getPermittedActions] error<e.message | ${tries}>:`,
					e.message
				);
				tries++;
			}
		}

		return actions;
	};

	/**
	 *
	 * Check if an action is permitted given the pkpid and ipfsId
	 *
	 * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
	 * @param { string } ipfsId  QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
	 *
	 * @return { object } transaction
	 */
	isPermittedAction = async (
		pkpId: string,
		ipfsId: string
	): Promise<boolean> => {
		console.log("[isPermittedAction] input<pkpId>:", pkpId);
		console.log("[isPermittedAction] input<ipfsId>:", ipfsId);

		const ipfsHash = getBytesFromMultihash(ipfsId);
		console.log("[isPermittedAction] converted<ipfsHash>:", ipfsHash);

		const bool = await this.contract.isPermittedAction(pkpId, ipfsHash);

		return bool;
	};
}

/**
 * (WRITE CLASS) All write functions on smart contract
 */
export class WritePKPPermissionsContract {
	contract: Contract;

	constructor(contract: Contract) {
		this.contract = contract;
	}

	/**
	 *
	 * Add permitted action to a given PKP id & ipfsId
	 *
	 * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
	 * @param { string } ipfsId  QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
	 *
	 * @return { object } transaction
	 */
	addPermittedAction = async (
		pkpId: string,
		ipfsId: string,
		routerContract: RouterContract
	): Promise<any> => {
		console.log("[addPermittedAction] input<pkpId>:", pkpId);

		const pubKey = await routerContract.read.getFullPubKey(pkpId);
		console.log("[addPermittedAction] converted<pubKey>:", pubKey);

		const pubKeyHash = ethers.utils.keccak256(pubKey);
		console.log("[addPermittedAction] converted<pubKeyHash>:", pubKeyHash);

		const tokenId = ethers.BigNumber.from(pubKeyHash);
		console.log("[addPermittedAction] converted<tokenId>:", tokenId);

		console.log("[addPermittedAction] input<ipfsId>:", ipfsId);

		const ipfsIdBytes = getBytesFromMultihash(ipfsId);
		console.log(
			"[addPermittedAction] converted<ipfsIdBytes>:",
			ipfsIdBytes
		);

		const tx = await this.contract.addPermittedAction(
			tokenId,
			ipfsIdBytes,
			[]
		);
		console.log("[addPermittedAction] output<tx>:", tx);

		return tx;
	};

	/**
	 * TODO: add transaction type
	 * Add permitted action to a given PKP id & ipfsId
	 *
	 * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
	 * @param { string } ownerAddress  0x3B5dD2605.....22aDC499A1
	 *
	 * @return { object } transaction
	 */
	addPermittedAddress = async (
		pkpId: string,
		ownerAddress: string,
		routerContract: RouterContract
	): Promise<any> => {
		console.log("[addPermittedAddress] input<pkpId>:", pkpId);
		console.log("[addPermittedAddress] input<ownerAddress>:", ownerAddress);

		console.log("[addPermittedAddress] input<pkpId>:", pkpId);

		const tx = await this.contract.addPermittedAddress(
			pkpId,
			ownerAddress,
			[]
		);

		console.log("[addPermittedAddress] output<tx>:", tx);

		return tx;
	};

	/**
	 * Revoke permitted action of a given PKP id & ipfsId
	 *
	 * @param { string } pkpId 103309008291725705563022469659474510532358692659842796086905702509072063991354
	 * @param { string } ipfsId  QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
	 *
	 * @return { object } transaction
	 */
	revokePermittedAction = async (
		pkpId: string,
		ipfsId: string
	): Promise<any> => {
		console.log("[revokePermittedAction] input<pkpId>:", pkpId);
		console.log("[revokePermittedAction] input<ipfsId>:", ipfsId);

		const ipfsHash = getBytesFromMultihash(ipfsId);
		console.log("[revokePermittedAction] converted<ipfsHash>:", ipfsHash);

		const tx = await this.contract.removePermittedAction(pkpId, ipfsHash);
		console.log("[revokePermittedAction] output<tx>:", tx);

		return tx;
	};
}
