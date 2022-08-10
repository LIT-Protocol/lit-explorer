// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import date from 'date-and-time';
import pinataSDK from '@pinata/sdk';
import { APP_CONFIG } from '../../../app_config';

type Data = {
  data?: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { id } = req.query;

  let hash : any = id ?? '';

  const API = process.env.PINATA_API ?? '';
  const SECRET = process.env.PINATA_SECRET ?? '';

  const pinata = pinataSDK(API, SECRET);

  const now = new Date();

  const createdAt = date.format(now, 'YYYY/MM/DD HH:mm:ss');

  let options : any = {
    pinataMetadata: {
        name: APP_CONFIG.IPFS_PIN_NAME,
        keyvalues: {
            created_at: createdAt,
            // customKey2: 'customValue2'
        }
    },
    // pinataOptions: {
    //     hostNodes: [
    //         '/ip4/hostNode1ExternalIP/tcp/4001/ipfs/hostNode1PeerId',
    //         '/ip4/hostNode2ExternalIP/tcp/4001/ipfs/hostNode2PeerId'
    //     ]
    // }
};

  pinata.pinByHash(hash, options).then((result) => {
    //handle results here
    console.log("SUCCESS:", result);
    
    const baseURL = process.env.NEXT_PUBLIC_IPFS_BASE_URL ?? '';
    
    console.log("baseURL:", baseURL);
    
    const data = {
      id: result.id,
      ipfsHash: result.ipfsHash,
      name: result.name,
      path: `${baseURL}/${result.ipfsHash}`,
    };

    res.status(200).json({ data })
  }).catch((err) => {
    //handle error here
    console.log("ERROR:", err);
  });
}