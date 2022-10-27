// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { APP_CONFIG, SupportedNetworks, SUPPORTED_CHAINS } from '../../app_config';

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

  const baseURL = APP_CONFIG.NETWORK.EXPLORER_API;
  const contractAddressHash = APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS;
  const query = `?module=token&action=getTokenHolders&contractaddress=${contractAddressHash}`;

  const dataRes = await fetch(`${baseURL}${query}`);

  let data = await dataRes.json();

  res.status(200).json({ data })
}