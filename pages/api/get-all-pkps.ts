// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PKPContract } from "../../utils/blockchain/contracts/PKPContract";
import { LitContracts } from "@lit-protocol/contracts-sdk";

type Data = {
  id?: string;
  body?: string;
  data?: any;
};
// https://explorer.celo.org/api-docs
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const litContracts = new LitContracts({
    privateKey:
      "af66563816f42e68a40923ad65f790b77645b8c779b1cfc74dbc206ad4a1a144",
  });
  await litContracts.connect();

  const tokens = await litContracts.pkpNftContractUtil.read.getTokens(10);

  console.log("tokens:", tokens);

  const data = {
    tokens,
  };

  res.status(200).json({ data });
}