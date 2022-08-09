// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { RouterContract } from '../../../utils/blockchain/contracts/RouterContract';

type Data = {
  id?: string
  body?: string,
  data?: any
}
// https://explorer.celo.org/api-docs
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const { id } = req.query;

    console.log("Found id:", id);

    console.log("Connecting router contract...");
    const routerContract = new RouterContract();
    await routerContract.connect()
    
    console.log("Getting permitted addresses...");
    const addresses = await routerContract.read.getPermittedAddresses(id);
    
    console.log("Getting permitted actions...");
    const actions = await routerContract.read.getPermittedActions(id);

    console.log("actions:", actions);

    const data = {
      addresses,
      actions,
    }
    
    res.status(200).json({ data })
}
