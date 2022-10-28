// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APP_CONFIG } from "../../app_config";
import { Alchemy } from "alchemy-sdk";

type Data = {
  id?: string;
  body?: string;
  data?: any;
  error?: Error;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const alchemy = new Alchemy(APP_CONFIG.ALCHEMY.SETTINGS); 

  const contractAddressHash = APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS;

  const data = await alchemy.nft.getOwnersForContract(contractAddressHash);

  res.status(200).json({ data });
}
