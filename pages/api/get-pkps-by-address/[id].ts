// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { VESUVIUS_APP_CONFIG, CHRONICLE_APP_CONFIG } from "../../../app_config";
import { RouterContract } from "../../../utils/blockchain/contracts/RouterContract";
import { decimalTohex, pub2Addr } from "../../../utils/converter";
import { asyncForEach } from "../../../utils/utils";
import { LitContracts } from "@lit-protocol/contracts-sdk";

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
		network === "datil-dev";

	if (!isNetworkSupported) {
		const msg = `Invalid network ${network} - must be cayenne, manzano or habanero`;

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

	if (network === "datil-dev") {
		const url = `https://vesuvius-explorer.litprotocol.com/api/v2/addresses/${id}/token-transfers`;

		const dataRes = await fetch(url);

		data = await dataRes.json();

		pkps = data.items
			.filter((item: any) => {
				return item.method === "mintNext";
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
