// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APP_CONFIG } from "../../app_config";
// import { Alchemy } from "alchemy-sdk";
const { toChecksumAddress } = require("ethereum-checksum-address");

type Data = {
	id?: string;
	body?: string;
	data?: any;
	error?: Error;
};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const baseURL = APP_CONFIG.API_URL;
	const contractAddressHash = APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS;
	const query = `?module=token&action=getTokenHolders&contractaddress=${contractAddressHash}`;

	const url = `${baseURL}${query}`;

	console.log("url", url);

	const dataRes = await fetch(url);

	const data = await dataRes.json();

	console.log("[get-all-pkp-owners] data:", data);

	res.status(200).json({ data: data.result });
}
