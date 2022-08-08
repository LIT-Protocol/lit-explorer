// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupportedNetworks, SUPPORTED_CHAINS } from '../../../app_config';

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
  const baseURL = SUPPORTED_CHAINS[SupportedNetworks.CELO_MAINNET].EXPLORER_API;
  const query = `?module=account&action=tokentx&address=${id}`;

  const dataRes = await fetch(`${baseURL}${query}`);

  let data = await dataRes.json();

  console.log(data);

  res.status(200).json({ 
    id: id?.toString(),
    data,
  })
}
