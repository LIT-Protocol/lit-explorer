// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APP_CONFIG } from "../../../app_config";

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

	console.log("[get-pkps-by-address] data:", data);

	res.status(200).json({
		id: id?.toString(),
		data,
	});
}
