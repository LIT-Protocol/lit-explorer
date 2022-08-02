// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getPubkeyRouterAndPermissionsContract from '../../../utils/blockchain/getPubkeyRouterAndPermissionsContract';

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

    const contract = await getPubkeyRouterAndPermissionsContract();

    const addresses = await contract.getPermittedAddresses(id);
    console.log("addresses:", addresses);
    const actions = await contract.getPermittedActions(id);

    console.log("actions:", actions);

    const data = {
      addresses,
      actions,
    }
    
    res.status(200).json({ data })
}
