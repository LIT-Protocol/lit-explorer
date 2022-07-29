// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

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

  const baseURL = process.env.NEXT_PUBLIC_CELO_API_BASE_URL;
  const contractAddressHash = process.env.NEXT_PUBLIC_PKP_NFT_CONTRACT;
  const query = `?module=token&action=getTokenHolders&contractaddress=${contractAddressHash}`;

  const dataRes = await fetch(`${baseURL}${query}`);

  let data = await dataRes.json();

  res.status(200).json({ data })
}