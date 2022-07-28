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

  const { id } = req.query;
//   const chainId = 44787;

//   first pkp wallet owner: 0x50e2dac5e78B5905CB09495547452cEE64426db2

  const baseURL = process.env.NEXT_PUBLIC_CELO_API_BASE_URL;

//   Get token transfer events by address. Up to a maximum of 10,000 token transfer events. Also available through a GraphQL 'token_transfers' query.
// ?module=account&action=tokentx&address={addressHash}

  
// Get list of tokens owned by address.
  const dataRes = await fetch(`${baseURL}?module=account&action=tokentx&address=${id}`);

  let data = await dataRes.json();

  res.status(200).json({ 
    id: id?.toString(),
    data,
  })
}
