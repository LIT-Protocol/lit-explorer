// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
	VESUVIUS_APP_CONFIG,
	YELLOWSTONE_APP_CONFIG,
	CHRONICLE_APP_CONFIG,
} from "../../../app_config";
import { RouterContract } from "../../../utils/blockchain/contracts/RouterContract";
import { decimalTohex, pub2Addr } from "../../../utils/converter";
import { asyncForEach } from "../../../utils/utils";
import { LitContracts } from "@lit-protocol/contracts-sdk";

// const DATIL_DEV = "https://apis.getlit.dev/datil-dev/addresses";
const DATIL_DEV_PKPNFT = "0x5526d5309Bb6caa560261aB37c1C28cC2ebe33c4";

// const DATIL_TEST = "https://apis.getlit.dev/datil-test/addresses";
const DATIL_TEST_PKPNFT = "0x6a0f439f064B7167A8Ea6B22AcC07ae5360ee0d1";

type Data = {
	id?: string;
	body?: string;
	data?: any;
};
// https://explorer.celo.org/api-docs
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { id } = req.query;

	// get ?network from query
	const network: any = req.query.network as string;

	const isNetworkSupported =
		network === "cayenne" ||
		network === "manzano" ||
		network === "habanero" ||
		network === "datil-dev" ||
		network === "datil-test";

	if (!isNetworkSupported) {
		const msg = `Invalid network ${network} - must be datil-dev, datil-test, cayenne, manzano or habanero`;

		res.status(500).json({
			data: new Error(msg),
		});

		throw new Error(msg);
	}

	// -- validate
	if (!id) {
		res.status(500).json({
			data: new Error("ID/Wallet address cannot be empty"),
		});

		throw new Error("ID/Wallet address cannot be empty");
	}

	let data;
	let pkps;

	if (network === "datil-dev" || network === "datil-test") {
		let url: string = "";

		let PKPNFTAddress: string | undefined = undefined;

		if (network === "datil-dev") {
			url = `https://vesuvius-explorer.litprotocol.com/api/v2/addresses/${id}/token-transfers`;
			PKPNFTAddress = DATIL_DEV_PKPNFT;
		}
		if (network === "datil-test") {
			url = `https://yellowstone-explorer.litprotocol.com/api/v2/addresses/${id}/token-transfers`;
			PKPNFTAddress = DATIL_TEST_PKPNFT;
		}

		if (url === "") {
			throw new Error("URL cannot be empty");
		}

		if (!PKPNFTAddress) {
			res.status(500).json({
				data: new Error("Invalid network"),
			});

			throw new Error("Invalid network");
		}

		const dataRes = await fetch(url);

		data = await dataRes.json();

		pkps = data.items
			.filter((item: any) => {
				return (
					item.method === "mintNext" &&
					item.token.address === PKPNFTAddress
				);
			})
			.map((item: any) => {
				return {
					blockHash: item.block_hash,
					tokenID: item.total.token_id,
					timeStamp: item.timestamp,
					hash: item.tx_hash,
				};
			});
	} else {
		const baseURL = CHRONICLE_APP_CONFIG.API_URL;
		const query = `?module=account&action=tokentx&address=${id}`;
		const url = `${baseURL}${query}`;
		console.log("url", url);

		const dataRes = await fetch(url);

		data = await dataRes.json();

		const contracts = new LitContracts({
			network,
		});

		await contracts.connect();

		const contractAddressHash = contracts.pkpNftContract.read.address;
		console.log(
			"[get-pkps-by-address] contractAddressHash",
			contractAddressHash
		);

		pkps = data.result.filter(
			(item: any) =>
				item.contractAddress === contractAddressHash.toLowerCase()
		);
	}

	const result = {
		id: id?.toString(),
		data: pkps,
	};

	console.log("result:", result);

	res.status(200).json(result);
}
