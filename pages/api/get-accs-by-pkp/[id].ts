// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getLatestBlock from '../../../utils/getLatestBlock';

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
  const { id } = req.query;
  const contractAddressHash = process.env.NEXT_PUBLIC_PKP_NFT_CONTRACT;
//   const contractAddressHash = '0x50e2dac5e78B5905CB09495547452cEE64426db2';

  const latestBlock = await getLatestBlock();
  
  const query = `?module=token&action=tokentx&contractaddress=${contractAddressHash}&fromBlock=0&toBlock=${latestBlock}`;

//   const query = `?module=token&action=getTokenHolders&contractaddress=${contractAddressHash}`;

  const dataRes = await fetch(`${baseURL}${query}`);

  let data = await dataRes.json();

  res.status(200).json({ data })
}
