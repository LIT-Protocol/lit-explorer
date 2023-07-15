// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PKPContract } from "../../utils/blockchain/contracts/PKPContract";

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
	const pkpContract = new PKPContract();

	await pkpContract.connect();

	const tokens = await pkpContract.read.getTokens(10);
	
	const data = {
		tokens,
	};

	res.status(200).json({ data });
}
