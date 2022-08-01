// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getPKPNFTContract from '../../utils/blockchain/getPKPNFTContract';
import pinataSDK, { PinataMetadataFilter, pinList } from '@pinata/sdk';

// @ts-ignore
import converter from 'hex2dec';

// https://github.com/PinataCloud/Pinata-SDK
// interface PinataFilterI extends pinList{
//   status?: string
//   pageLimit?: number
//   pageOffet?: string
//   metadata?: string
// }

// interface PinataMetaFilterI extends PinataMetadataFilter{
//   meta
// }

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

  const API = process.env.PINATA_API ?? '';
  const SECRET = process.env.PINATA_SECRET ?? '';

  const pinata = pinataSDK(API, SECRET);


  let filters: any = {
    metadata: {
      name: 'Lit Explorer'
    }
  }

  const list = await pinata.pinList(filters);

  console.log("List:", list);

  const data = list

  res.status(200).json({ data })
}