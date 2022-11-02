// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PKPPermissionsContract } from '../../../utils/blockchain/contracts/PKPPermissionsContract';
import getWeb3Wallet from '../../../utils/blockchain/getWeb3Wallet';

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

    const pkpId = id;

    console.log('[api/get-permitted-by-pkp] input<pkpId>:', pkpId);
    
    const pkpPermissionsContract = new PKPPermissionsContract();
    
    await pkpPermissionsContract.connect()
    
    let addresses;
    let actions;

    const maxTries = 5;
    let tries = 0;

    while (tries < maxTries) {
      try {
        addresses = await pkpPermissionsContract.read.getPermittedAddresses(pkpId);
        actions = await pkpPermissionsContract.read.getPermittedActions(pkpId);
        console.log('[api/get-permitted-by-pkp] output<addresses>:', addresses);
        console.log('[api/get-permitted-by-pkp] output<actions>:', actions);
        break;
      } catch (error) {
        console.log(`[api/get-permitted-by-pkp] error[${tries}]:`, error);
        tries++;
      }
    }

    const data = { addresses, actions }
    
    res.status(200).json({ data })
}
