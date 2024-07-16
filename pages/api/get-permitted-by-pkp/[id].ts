// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { BigNumberish } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

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
		network === "datil-test"

	if (!isNetworkSupported) {
		const msg = `Invalid network ${network} - must be datil-dev, datil-test, cayenne, manzano or habanero`;

		res.status(500).json({
			data: new Error(msg),
		});

		throw new Error(msg);
	}

	const pkpId = id;

	console.log("[api/get-permitted-by-pkp] input<pkpId>:", pkpId);

	const contracts = new LitContracts({ network });

	await contracts.connect();

	let addresses =
		await contracts.pkpPermissionsContract.read.getPermittedAddresses(
			pkpId as BigNumberish
		);
	let actions =
		await contracts.pkpPermissionsContract.read.getPermittedActions(
			pkpId as BigNumberish
		);

	const data = { addresses, actions };

	res.status(200).json({ data });
}
