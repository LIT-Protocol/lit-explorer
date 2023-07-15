// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APP_CONFIG } from "../../../app_config";
import { RouterContract } from "../../../utils/blockchain/contracts/RouterContract";
import { decimalTohex, pub2Addr } from "../../../utils/converter";
import { asyncForEach } from "../../../utils/utils";

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

	// -- validate
	if (!id) {
		res.status(500).json({
			data: new Error("ID/Wallet address cannot be empty"),
		});

		throw new Error("ID/Wallet address cannot be empty");
	}
	const baseURL = APP_CONFIG.API_URL;
	const query = `?module=account&action=tokentx&address=${id}`;

	const dataRes = await fetch(`${baseURL}${query}`);

	const data = await dataRes.json();

	let pkps = data.result
		.filter((item: any) => item.tokenSymbol === "PKP")
		.filter(
			(item: any) =>
				item.contractAddress ===
				APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS.toLowerCase()
		);

	console.log("pkps", pkps);

	res.status(200).json({
		id: id?.toString(),
		data: pkps,
	});
}
