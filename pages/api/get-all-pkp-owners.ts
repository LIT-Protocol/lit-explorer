// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APP_CONFIG } from "../../app_config";
// import { Alchemy } from "alchemy-sdk";
const { toChecksumAddress } = require("ethereum-checksum-address");
import { LitContracts } from "@lit-protocol/contracts-sdk";

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
	const contracts = new LitContracts();
	await contracts.connect();
	const contractAddressHash = contracts.pkpNftContract.read.address;

	const query = `?module=token&action=getTokenHolders&contractaddress=${contractAddressHash}`;

	const url = `${baseURL}${query}`;

	console.log("url", url);

	const dataRes = await fetch(url);

	const data = await dataRes.json();

	console.log("[get-all-pkp-owners] data:", data);

	res.status(200).json({ data: data.result });
}
