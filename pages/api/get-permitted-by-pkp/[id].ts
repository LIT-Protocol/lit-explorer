// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { APP_CONFIG, SupportedNetworks } from '../../../app_config';
import { PKPPermissionsContract } from '../../../utils/blockchain/contracts/PKPPermissionsContract';

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

    console.log('[api/get-permitted-by-pkp] input<id>:', id);
    
    const pkpPermissionsContract = new PKPPermissionsContract();
    await pkpPermissionsContract.connect()
    
    const addresses = await pkpPermissionsContract.read.getPermittedAddresses(id);
    console.log('[api/get-permitted-by-pkp] output<addresses>:', addresses);
    
    const actions = await pkpPermissionsContract.read.getPermittedActions(id);
    console.log('[api/get-permitted-by-pkp] output<actions>:', actions);

    const data = { addresses, actions }
    
    res.status(200).json({ data })
}
