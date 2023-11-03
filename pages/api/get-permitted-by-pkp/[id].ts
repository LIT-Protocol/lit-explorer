// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BigNumberish, ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { PKPPermissionsContract } from "../../../utils/blockchain/contracts/PKPPermissionsContract";
import getWeb3Wallet from "../../../utils/blockchain/getWeb3Wallet";
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

	const pkpId = id;

	console.log("[api/get-permitted-by-pkp] input<pkpId>:", pkpId);

	const contracts = new LitContracts();

	await contracts.connect();
	
	let addresses = await contracts.pkpPermissionsContract.read.getPermittedAddresses(
		pkpId as BigNumberish
	);
	let actions = await contracts.pkpPermissionsContract.read.getPermittedActions(pkpId as BigNumberish);

	const data = { addresses, actions };

	res.status(200).json({ data });
}
