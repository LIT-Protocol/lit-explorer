// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { APP_CONFIG } from '../../../app_config';
import { Alchemy } from "alchemy-sdk";

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

  // -- validate
  if ( ! id ){
    res.status(500).json({ 
      data: new Error("ID/Wallet address cannot be empty"),
    })

    throw new Error("ID/Wallet address cannot be empty");
  }

  const walletAddress = id.toString()

  const alchemy = new Alchemy(APP_CONFIG.ALCHEMY.SETTINGS); 

  const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
    contractAddresses: [APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS],
  });

  console.log("nfts:", nfts);

  res.status(200).json({ 
    id: id?.toString(),
    data: nfts,
  })
}
