// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getPKPNFTContract from '../../utils/blockchain/getPKPNFTContract';

// @ts-ignore
import converter from 'hex2dec';

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

  const contract = await getPKPNFTContract();
  
  let tokens = [];

  for(let i = 0;; i++){

    let token;

    try{

      token = JSON.parse(JSON.stringify(await contract.tokenByIndex(i)));

      token = converter.hexToDec(token.hex); 

      tokens.push(token);
    
    }catch(e){
      console.log(`End of loop: ${i}`)
      break;
    }
  }

  const data = {
    tokens
  }

  res.status(200).json({ data })
}