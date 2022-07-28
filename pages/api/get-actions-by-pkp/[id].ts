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

    const data = await contract.getPermittedAddresses(id);

    res.status(200).json({ data })
}
