// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APP_CONFIG } from "../../../app_config";
import { LitContracts } from "@lit-protocol/contracts-sdk";

type Data = {
	id?: string;
	body?: string;
	data?: any;
};

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
		const msg = `Invalid network ${network} - must be datil-dev, cayenne, manzano or habanero`;

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
	const baseURL = APP_CONFIG.API_URL;
	const query = `?module=account&action=tokentx&address=${id}`;
	const url = `${baseURL}${query}`;

	const dataRes = await fetch(url);

	const data = await dataRes.json();

	const contracts = new LitContracts({ network });
	await contracts.connect();
	const contractAddressHash = contracts.rateLimitNftContract.read.address;

	let rlis = data.result.filter(
		(item: any) =>
			item.contractAddress === contractAddressHash.toLowerCase()
	);

	res.status(200).json({
		id: id?.toString(),
		data: rlis,
	});
}
